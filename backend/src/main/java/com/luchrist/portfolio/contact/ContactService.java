package com.luchrist.portfolio.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository messages;
    private final ContactProperties properties;
    private final ContactIpLimiter ipLimiter;
    private final org.springframework.context.ApplicationEventPublisher events;

    public ContactService(ContactMessageRepository messages, ContactProperties properties,
                          ContactIpLimiter ipLimiter, org.springframework.context.ApplicationEventPublisher events) {
        this.messages = messages;
        this.properties = properties;
        this.ipLimiter = ipLimiter;
        this.events = events;
    }

    @Transactional
    public void receive(ContactRequest request) {
        receive(request, null);
    }

    @Transactional
    public void receive(ContactRequest request, String remoteAddress) {
        if (request.isRobot()) {
            // Aucun enregistrement, mais le robot recevra la même réponse qu'un humain.
            log.info("Contact message ignored: honeypot field was filled");
            return;
        }
        // Le verrou transactionnel sérialise les envois concurrents d'une même adresse.
        String email = request.email();
        int separator = email.lastIndexOf('@');
        email = email.substring(0, separator + 1)
                + email.substring(separator + 1).toLowerCase(java.util.Locale.ROOT);
        messages.lockEmail(email);
        java.time.OffsetDateTime now = java.time.OffsetDateTime.now();
        var recent = messages.findByEmailAndCreatedAtAfterOrderByCreatedAtAsc(
                email, now.minus(properties.window()));
        if (recent.size() >= properties.emailLimit()) {
            throw new ContactRateLimitException(java.time.Duration.between(now,
                    recent.getFirst().getCreatedAt().plus(properties.window())).toSeconds() + 1);
        }
        if (remoteAddress != null) ipLimiter.acquire(remoteAddress);
        ContactMessage message = messages.save(new ContactMessage(request.name(), email, request.message()));
        events.publishEvent(new ContactReceived(message.getId()));
    }
}
