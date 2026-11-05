package com.luchrist.portfolio.contact;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactMailDelivery {
    private static final Logger log = LoggerFactory.getLogger(ContactMailDelivery.class);
    private final ContactMessageRepository messages;
    private final ContactProperties properties;
    private final ObjectProvider<JavaMailSender> sender;
    private final Environment environment;

    public ContactMailDelivery(ContactMessageRepository messages, ContactProperties properties,
                               ObjectProvider<JavaMailSender> sender, Environment environment) {
        this.messages = messages;
        this.properties = properties;
        this.sender = sender;
        this.environment = environment;
    }

    @jakarta.annotation.PostConstruct
    void checkConfiguration() {
        if (!isConfigured()) {
            log.warn("Contact mail delivery disabled: SMTP host or recipient missing");
        }
    }

    private boolean isConfigured() {
        return !environment.getProperty("spring.mail.host", "").isBlank() && !properties.to().isBlank();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deliver(Long id) {
        if (!isConfigured()) return;
        ContactMessage message = messages.findForDelivery(id).orElse(null);
        if (message == null || "sent".equals(message.getStatus()) || message.getSendAttempts() >= 5
                || message.getCreatedAt().isBefore(OffsetDateTime.now().minusHours(24))) return;
        message.startAttempt();
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(properties.to());
            mail.setFrom(properties.from());
            mail.setReplyTo(message.getEmail());
            mail.setSubject("Nouveau message — Portfolio LUCHRIST");
            mail.setText("Nom : " + message.getName() + "\nE-mail : " + message.getEmail()
                    + "\nDate : " + message.getCreatedAt().atZoneSameInstant(ZoneId.of("Africa/Douala"))
                    .format(DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss VV"))
                    + "\n\n" + message.getMessage());
            sender.getObject().send(mail);
            message.markSent();
        } catch (Exception exception) {
            message.markFailed();
            log.warn("Contact mail delivery failed");
        }
    }
}
