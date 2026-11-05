package com.luchrist.portfolio.common;

import com.jayway.jsonpath.JsonPath;
import com.luchrist.portfolio.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class OpenApiDocumentTests {
    @Autowired MockMvc mvc;

    @Test void declaresTheCurrentHostAsRelativeServer() throws Exception {
        mvc.perform(get("/api/docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.servers.length()").value(1))
                .andExpect(jsonPath("$.servers[0].url").value("/"))
                .andExpect(jsonPath("$.servers[0].description").value("Current host"));
    }

    @Test void documentsOnlyTheContactRequestFields() throws Exception {
        String docs = mvc.perform(get("/api/docs"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Map<String, Object> properties = JsonPath.read(docs, "$.components.schemas.ContactRequest.properties");
        assertThat(properties).containsOnlyKeys("name", "email", "message", "botcheck");
        assertThat((String) JsonPath.read(docs, "$.components.schemas.ContactRequest.properties.email.example"))
                .isEqualTo("awa@example.com");
    }
}
