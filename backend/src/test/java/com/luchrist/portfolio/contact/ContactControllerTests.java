package com.luchrist.portfolio.contact;

import com.luchrist.portfolio.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@Transactional
class ContactControllerTests {
    @Autowired MockMvc mvc;
    @Autowired ContactMessageRepository messages;

    private String body(String email, boolean robot) {
        return """
                {"name":"Example Visitor","email":"%s","message":"A valid contact message.","botcheck":%s}
                """.formatted(email, robot);
    }

    @Test void acceptsValidMessage() throws Exception {
        mvc.perform(post("/api/contact").contentType("application/json").content(body("valid@example.com", false)))
                .andExpect(status().isAccepted());
        assertThat(messages.count()).isEqualTo(1);
    }

    @Test void reportsInvalidFieldsWithoutValues() throws Exception {
        mvc.perform(post("/api/contact").contentType("application/json")
                .content("{\"name\":\"A\",\"email\":\"invalid\",\"message\":\"short\"}"))
                .andExpect(status().isBadRequest()).andExpect(content().contentTypeCompatibleWith("application/problem+json"))
                .andExpect(jsonPath("$.errors.name").value("size"))
                .andExpect(jsonPath("$.errors.email").value("pattern"))
                .andExpect(jsonPath("$.errors.message").value("size"));
    }

    @Test void rejectsUnreadableJson() throws Exception {
        mvc.perform(post("/api/contact").contentType("application/json").content("{"))
                .andExpect(status().isBadRequest()).andExpect(content().contentTypeCompatibleWith("application/problem+json"));
    }

    @Test void ignoresRobot() throws Exception {
        mvc.perform(post("/api/contact").contentType("application/json").content(body("robot@example.com", true)))
                .andExpect(status().isAccepted());
        assertThat(messages.count()).isZero();
    }

    @Test void ignoresRobotEvenWithInvalidFields() throws Exception {
        mvc.perform(post("/api/contact").contentType("application/json")
                .content("{\"botcheck\":true}"))
                .andExpect(status().isAccepted());
        assertThat(messages.count()).isZero();
    }

    @Test void limitsSixthMessageForSameIp() throws Exception {
        for (int i = 0; i < 5; i++) {
            mvc.perform(post("/api/contact").with(r -> { r.setRemoteAddr("192.0.2.20"); return r; })
                    .contentType("application/json").content(body("ip" + i + "@example.com", false)))
                    .andExpect(status().isAccepted());
        }
        mvc.perform(post("/api/contact").with(r -> { r.setRemoteAddr("192.0.2.20"); return r; })
                .contentType("application/json").content(body("ip6@example.com", false)))
                .andExpect(status().isTooManyRequests()).andExpect(header().exists("Retry-After"));
    }

    @Test void exposesOpenApiAndSwagger() throws Exception {
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("LUCHRIST Portfolio API"))
                .andExpect(jsonPath("$.info.version").value("2.0.0"));
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/docs/ui"))
                .andExpect(status().is3xxRedirection());
    }

    @Test void preservesNotFoundStatus() throws Exception {
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/projects/missing-example"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith("application/problem+json"));
    }

    @Test void limitsFourthMessageForSameEmail() throws Exception {
        for (int i = 0; i < 3; i++) {
            mvc.perform(post("/api/contact").with(r -> { r.setRemoteAddr("192.0.2.10"); return r; })
                    .contentType("application/json").content(body("limited@example.com", false)))
                    .andExpect(status().isAccepted());
        }
        mvc.perform(post("/api/contact").with(r -> { r.setRemoteAddr("192.0.2.10"); return r; })
                .contentType("application/json").content(body("limited@EXAMPLE.COM", false)))
                .andExpect(status().isTooManyRequests()).andExpect(header().exists("Retry-After"));
    }
}
