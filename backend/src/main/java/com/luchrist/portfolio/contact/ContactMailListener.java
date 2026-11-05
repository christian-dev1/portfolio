package com.luchrist.portfolio.contact;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class ContactMailListener {
    private final ContactMailDelivery delivery;
    public ContactMailListener(ContactMailDelivery delivery) { this.delivery = delivery; }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void received(ContactReceived event) { delivery.deliver(event.id()); }
}
