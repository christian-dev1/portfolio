package com.luchrist.portfolio.project;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Transactional;

import com.luchrist.portfolio.TestcontainersConfiguration;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ProjectRepositoryTests {

    @Autowired
    private ProjectRepository projects;

    @Test
    void returnsVisibleProjectsInDisplayOrder() {
        List<String> slugs = projects.findByVisibleTrueOrderByPositionAsc().stream()
                .map(Project::getSlug)
                .toList();

        assertThat(slugs).containsExactly("wimo", "vesty-shop", "sekouh", "superapp");
    }
    @Test
    @Transactional
    void loadsHighlightsRolesAndTools() {
        Project wimo = projects.findByVisibleTrueOrderByPositionAsc().get(0);

        assertThat(wimo.getHighlights()).hasSize(3);
        assertThat(wimo.getHighlights().get(0).getText().fr())
                .startsWith("Conception et développement");
        assertThat(wimo.getRoles()).containsExactly("Backend", "Frontend", "QA");
        assertThat(wimo.getTools())
                .extracting(tool -> tool.getSlug())
                .contains("java", "spring-boot", "postgresql", "docker");
    }
    @Test
    void readsTheBilingualSummary() {
        Project first = projects.findByVisibleTrueOrderByPositionAsc().get(0);

        assertThat(first.getSummary().fr())
                .isEqualTo("Application de transfert d'argent.");
    }
}
