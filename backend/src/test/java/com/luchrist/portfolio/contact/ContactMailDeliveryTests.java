package com.luchrist.portfolio.contact;

import java.time.Duration;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.env.MockEnvironment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ContactMailDeliveryTests {
    private final ContactMessageRepository messages = mock(ContactMessageRepository.class);
    private final JavaMailSender sender = mock(JavaMailSender.class);
    @SuppressWarnings("unchecked")
    private final ObjectProvider<JavaMailSender> provider = mock(ObjectProvider.class);
    private final ContactProperties properties = new ContactProperties(3, 5, Duration.ofHours(1),
            Duration.ofDays(180), "contact@example.com", "portfolio@example.com");

    @Test void marksFailedAndCountsSmtpFailure() {
        ContactMessage message = new ContactMessage("Example Visitor", "visitor@example.com", "A delivery test message.");
        when(messages.findForDelivery(1L)).thenReturn(Optional.of(message));
        when(provider.getObject()).thenReturn(sender);
        doThrow(new MailSendException("SMTP unavailable")).when(sender).send(any(SimpleMailMessage.class));
        new ContactMailDelivery(messages, properties, provider,
                new MockEnvironment().withProperty("spring.mail.host", "localhost")).deliver(1L);
        assertThat(message.getStatus()).isEqualTo("failed");
        assertThat(message.getSendAttempts()).isEqualTo((short) 1);
    }

    @Test void skipsDeliveryWhenSmtpHostMissing() {
        new ContactMailDelivery(messages, properties, provider, new MockEnvironment()).deliver(1L);
        verifyNoInteractions(messages, provider, sender);
    }

    @Test void skipsDeliveryWhenRecipientMissing() {
        ContactProperties missingRecipient = new ContactProperties(3, 5, Duration.ofHours(1),
                Duration.ofDays(180), "", "portfolio@example.com");
        new ContactMailDelivery(messages, missingRecipient, provider,
                new MockEnvironment().withProperty("spring.mail.host", "localhost")).deliver(1L);
        verifyNoInteractions(messages, provider, sender);
    }

    @Test void stopsAfterFiveAttempts() {
        ContactMessage message = new ContactMessage("Example Visitor", "visitor@example.com", "A delivery test message.");
        for (int i = 0; i < 5; i++) message.startAttempt();
        message.markFailed();
        when(messages.findForDelivery(1L)).thenReturn(Optional.of(message));
        new ContactMailDelivery(messages, properties, provider,
                new MockEnvironment().withProperty("spring.mail.host", "localhost")).deliver(1L);
        assertThat(message.getSendAttempts()).isEqualTo((short) 5);
        verifyNoInteractions(provider, sender);
    }
}
