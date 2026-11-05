package com.luchrist.portfolio.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository messages;

    public ContactService(ContactMessageRepository messages) {
        this.messages = messages;
    }

    @Transactional
    public void receive(ContactRequest request) {
        if (request.isRobot()) {
            // Aucun enregistrement, mais le robot recevra la même réponse qu'un humain.
            log.info("Contact message ignored: honeypot field was filled");
            return;
        }
        messages.save(new ContactMessage(request.name(), request.email(), request.message()));
    }
}
