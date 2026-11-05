package com.luchrist.portfolio.contact;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import com.luchrist.portfolio.TestcontainersConfiguration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class ForwardedContactTests {
    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    void limitsThePublicVisitorBehindPrivateProxiesInsteadOfTheProxyOrSpoofedPrefix() throws Exception {
        for (int i = 0; i < 5; i++) {
            assertThat(send("forwarded" + i, "198.51.100." + (i + 1)
                    + ", 203.0.113.42, " + (i == 4 ? "fd00::1" : "172.20.0.1")).statusCode()).isEqualTo(202);
        }

        HttpResponse<String> limited = send("forwarded-limit", "198.51.100.99, 203.0.113.42, 10.0.0.1");
        assertThat(limited.statusCode()).isEqualTo(429);
        assertThat(limited.headers().firstValue("Retry-After")).isPresent();
        assertThat(limited.headers().firstValue("Content-Type").orElseThrow()).contains("application/problem+json");

        assertThat(send("other-visitor", "203.0.113.43, 172.20.0.1").statusCode()).isEqualTo(202);
    }

    private HttpResponse<String> send(String emailName, String forwardedFor) throws Exception {
        String body = """
                {"name":"Example Visitor","email":"%s@example.com","message":"A valid contact message.","botcheck":false}
                """.formatted(emailName);
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/contact"))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .header("X-Forwarded-For", forwardedFor)
                .header("X-Forwarded-Proto", "https")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
