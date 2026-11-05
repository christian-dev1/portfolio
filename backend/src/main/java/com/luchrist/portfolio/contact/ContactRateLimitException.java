package com.luchrist.portfolio.contact;

public class ContactRateLimitException extends RuntimeException {
    private final long retryAfter;

    public ContactRateLimitException(long retryAfter) {
        super("Contact rate limit exceeded");
        this.retryAfter = Math.max(1, retryAfter);
    }

    public long getRetryAfter() { return retryAfter; }
}
