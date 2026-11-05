package com.luchrist.portfolio;

import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistrar;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {
    @Bean
    @ServiceConnection
    PostgreSQLContainer postgresContainer() {
        return new PostgreSQLContainer(DockerImageName.parse("postgres:latest"));
    }

    @Bean
    GenericContainer<?> mailpitContainer() {
        return new GenericContainer<>(DockerImageName.parse("axllent/mailpit"))
                .withEnv("MP_SMTP_DISABLE_RDNS", "true")
                .withExposedPorts(1025, 8025);
    }

    @Bean
    DynamicPropertyRegistrar mailProperties(GenericContainer<?> mailpitContainer) {
        return registry -> {
            registry.add("spring.mail.host", mailpitContainer::getHost);
            registry.add("spring.mail.port", () -> mailpitContainer.getMappedPort(1025));
            registry.add("spring.mail.properties.mail.smtp.auth", () -> false);
            registry.add("spring.mail.properties.mail.smtp.starttls.enable", () -> false);
            registry.add("portfolio.contact.to", () -> "contact@example.com");
            registry.add("portfolio.contact.from", () -> "portfolio@example.com");
            LoggerFactory.getLogger(TestcontainersConfiguration.class).info("Mailpit UI: http://{}:{}",
                    mailpitContainer.getHost(), mailpitContainer.getMappedPort(8025));
        };
    }
}
