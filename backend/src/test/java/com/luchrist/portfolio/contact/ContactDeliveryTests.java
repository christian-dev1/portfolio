package com.luchrist.portfolio.contact;

import com.luchrist.portfolio.TestcontainersConfiguration;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.containers.GenericContainer;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ContactDeliveryTests {
    @Autowired ContactService service;
    @Autowired ContactMessageRepository messages;
    @Autowired ContactMaintenance maintenance;
    @Autowired JdbcTemplate jdbc;
    @Autowired TransactionTemplate transactions;
    @Autowired GenericContainer<?> mailpitContainer;
    @Autowired org.springframework.mail.javamail.JavaMailSender mailSender;

    @BeforeEach void awaitSmtp() {
        await().atMost(Duration.ofSeconds(30)).untilAsserted(() ->
                ((org.springframework.mail.javamail.JavaMailSenderImpl) mailSender).testConnection());
    }

    private JsonNode get(String path) throws Exception {
        String url = "http://" + mailpitContainer.getHost() + ":" + mailpitContainer.getMappedPort(8025) + path;
        var response = HttpClient.newHttpClient().send(HttpRequest.newBuilder(URI.create(url)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).isEqualTo(200);
        return JsonMapper.builder().build().readTree(response.body());
    }

    @Test void deliversAfterCommitWithFixedSubjectAndReplyTo() {
        Long id = transactions.execute(status -> {
            service.receive(new ContactRequest("Example Visitor", "delivery@example.com", "A delivery test message.", false));
            ContactMessage saved = messages.findAll().stream()
                    .filter(m -> m.getEmail().equals("delivery@example.com")).findFirst().orElseThrow();
            assertThat(saved.getStatus()).isEqualTo("received");
            return saved.getId();
        });
        try {
            await().atMost(Duration.ofSeconds(30)).untilAsserted(() -> {
                assertThat(messages.findById(id).orElseThrow().getStatus()).isEqualTo("sent");
                JsonNode list = get("/api/v1/messages");
                boolean found = false;
                for (JsonNode entry : list.path("messages")) {
                    JsonNode mail = get("/api/v1/message/" + entry.path("ID").asText());
                    if (mail.path("ReplyTo").toString().contains("delivery@example.com")) {
                        assertThat(mail.path("Subject").asText()).isEqualTo("Nouveau message — Portfolio LUCHRIST");
                        assertThat(mail.path("Text").asText()).contains("Example Visitor", "delivery@example.com", "Africa/Douala");
                        found = true;
                    }
                }
                assertThat(found).isTrue();
            });
        } finally { messages.deleteById(id); }
    }

    @Test void retriesFailedMessageAndIncrementsAttempts() {
        ContactMessage message = new ContactMessage("Example Visitor", "retry@example.com", "A retry test message.");
        message.startAttempt();
        message.markFailed();
        Long id = messages.saveAndFlush(message).getId();
        try {
            maintenance.retry();
            ContactMessage saved = messages.findById(id).orElseThrow();
            assertThat(saved.getStatus()).isEqualTo("sent");
            assertThat(saved.getSendAttempts()).isEqualTo((short) 2);
        } finally { messages.deleteById(id); }
    }

    @Test void purgesOnlyExpiredMessages() {
        Long old = messages.saveAndFlush(new ContactMessage("Old Visitor", "old@example.com", "An old test message.")).getId();
        Long recent = messages.saveAndFlush(new ContactMessage("New Visitor", "new@example.com", "A recent test message.")).getId();
        jdbc.update("update contact_message set created_at = now() - interval '181 days' where id = ?", old);
        try {
            maintenance.purge();
            assertThat(messages.existsById(old)).isFalse();
            assertThat(messages.existsById(recent)).isTrue();
        } finally { messages.deleteAllById(java.util.List.of(old, recent)); }
    }
}
