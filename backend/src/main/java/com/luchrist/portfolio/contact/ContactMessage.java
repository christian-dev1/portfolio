package com.luchrist.portfolio.contact;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contact_message")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String message;
    private String status;

    @Column(name = "send_attempts")
    private short sendAttempts;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    protected ContactMessage() {
        // utilisé par Hibernate
    }

    public ContactMessage(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.status = "received";
        this.createdAt = OffsetDateTime.now();
    }

    void startAttempt() {
        sendAttempts++;
    }

    void markSent() {
        status = "sent";
    }

    void markFailed() {
        status = "failed";
    }

    public short getSendAttempts() {
        return sendAttempts;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
