package com.luchrist.portfolio.contact;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ContactIpLimiter {
    private final Map<String, ArrayDeque<Instant>> entries = new HashMap<>();
    private final ContactProperties properties;

    public ContactIpLimiter(ContactProperties properties) {
        this.properties = properties;
    }

    public synchronized void acquire(String ip) {
        Instant now = Instant.now();
        purge(now);
        ArrayDeque<Instant> times = entries.computeIfAbsent(ip, key -> new ArrayDeque<>());
        if (times.size() >= properties.ipLimit()) {
            throw new ContactRateLimitException(Duration.between(now,
                    times.getFirst().plus(properties.window())).toSeconds() + 1);
        }
        times.addLast(now);
    }

    @Scheduled(fixedDelay = 60000)
    public synchronized void purgeExpired() {
        purge(Instant.now());
    }

    private void purge(Instant now) {
        entries.values().forEach(times -> {
            while (!times.isEmpty() && !times.getFirst().isAfter(now.minus(properties.window()))) {
                times.removeFirst();
            }
        });
        entries.values().removeIf(ArrayDeque::isEmpty);
    }
}
