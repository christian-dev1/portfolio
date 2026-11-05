package com.luchrist.portfolio.contact;

import com.luchrist.portfolio.TestcontainersConfiguration;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@Transactional // chaque test est annulé à la fin : la table reste vide
class ContactServiceTests {

    @Autowired
    private ContactService contactService;

    @Autowired
    private ContactMessageRepository messages;

    @Autowired
    private Validator validator;

    @Test
    void savesAValidMessageWithTrimmedFields() {
        contactService.receive(new ContactRequest(
                "  Awa  ", "awa@example.com", "Bonjour, j'aimerais parler d'un stage.", false));

        List<ContactMessage> saved = messages.findAll();
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).getName()).isEqualTo("Awa");
        assertThat(saved.get(0).getStatus()).isEqualTo("received");
        assertThat(saved.get(0).getCreatedAt()).isNotNull();
    }

    @Test
    void ignoresRobots() {
        contactService.receive(new ContactRequest(
                "Robot", "robot@example.com", "Achetez nos produits miracles !", true));

        assertThat(messages.findAll()).isEmpty();
    }

    @Test
    void rejectsInvalidRequests() {
        Set<ConstraintViolation<ContactRequest>> violations =
                validator.validate(new ContactRequest("A", "pas-un-email", "court", null));

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactlyInAnyOrder("name", "email", "message");
    }
}
