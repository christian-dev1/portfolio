package com.luchrist.portfolio.contact;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties("portfolio.contact")
public record ContactProperties(
        @DefaultValue("3") int emailLimit,
        @DefaultValue("5") int ipLimit,
        @DefaultValue("1h") Duration window,
        @DefaultValue("180d") Duration retention,
        @DefaultValue("") String to,
        @DefaultValue("noreply@example.com") String from) {
    public ContactProperties {
        if (emailLimit < 1 || ipLimit < 1 || window.isNegative() || window.isZero()
                || retention.isNegative() || retention.isZero()) {
            throw new IllegalArgumentException("Invalid contact limits or durations");
        }
    }
}
