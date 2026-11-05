package com.luchrist.portfolio.contact;

import java.time.OffsetDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactMaintenance {
    private static final Logger log = LoggerFactory.getLogger(ContactMaintenance.class);
    private final ContactMessageRepository messages;
    private final ContactMailDelivery delivery;
    private final ContactProperties properties;

    public ContactMaintenance(ContactMessageRepository messages, ContactMailDelivery delivery,
                              ContactProperties properties) {
        this.messages = messages;
        this.delivery = delivery;
        this.properties = properties;
    }

    @Scheduled(fixedDelay = 900000, initialDelay = 900000)
    @Transactional(readOnly = true)
    public void retry() {
        OffsetDateTime now = OffsetDateTime.now();
        messages.findRetryCandidates(now.minus(properties.retryMaxAge()), now.minusMinutes(5),
                properties.maxAttempts()).forEach(delivery::deliver);
    }

    @Scheduled(cron = "0 15 3 * * *", zone = "Africa/Douala")
    @Transactional
    public void purge() {
        long deleted = messages.deleteByCreatedAtBefore(OffsetDateTime.now().minus(properties.retention()));
        log.info("Contact messages deleted: {}", deleted);
    }
}
