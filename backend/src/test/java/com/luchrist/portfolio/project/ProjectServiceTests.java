package com.luchrist.portfolio.project;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.web.server.ResponseStatusException;

import com.luchrist.portfolio.TestcontainersConfiguration;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ProjectServiceTests {

    @Autowired
    private ProjectService projectService;

    @Test
    void returnsProjectsInTheFrontendFormat() {
        List<ProjectResponse> projects = projectService.findVisibleProjects();

        assertThat(projects).extracting(ProjectResponse::id)
                .containsExactly("wimo", "vesty-shop", "sekouh", "superapp");

        ProjectResponse wimo = projects.get(0);
        assertThat(wimo.highlights()).hasSize(3);
        assertThat(wimo.technologies()).contains("Spring Boot", "PostgreSQL");
        assertThat(wimo.logoUrl()).isNull();
    }

    // NOUVEAU : un projet existant est trouvé
    @Test
    void returnsOneProjectBySlug() {
        ProjectResponse superApp = projectService.findVisibleProject("superapp");

        assertThat(superApp.name()).isEqualTo("SuperApp");
    }

    // NOUVEAU : un projet inconnu provoque une erreur 404
    @Test
    void rejectsUnknownProject() {
        assertThatThrownBy(() -> projectService.findVisibleProject("inconnu"))
                .isInstanceOf(ResponseStatusException.class);
    }
}
