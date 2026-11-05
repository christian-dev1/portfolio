package com.luchrist.portfolio;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Règles métier sur les données du portfolio, vérifiées contre un vrai PostgreSQL
 * (Testcontainers) après application de toutes les migrations Flyway.
 */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class DataQualityTests {

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void everyVisibleProjectHasAtLeastOneHighlight() {
        List<String> projectsWithoutHighlight = jdbc.queryForList("""
                SELECT p.slug
                FROM project p
                WHERE p.visible
                  AND NOT EXISTS (
                      SELECT 1 FROM project_highlight h WHERE h.project_id = p.id
                  )
                """, String.class);

        assertThat(projectsWithoutHighlight)
                .as("projets visibles sans aucun point fort")
                .isEmpty();
    }

    @Test
    void everyVisibleProjectUsesAtLeastOneTool() {
        List<String> projectsWithoutTool = jdbc.queryForList("""
                SELECT p.slug
                FROM project p
                WHERE p.visible
                  AND NOT EXISTS (
                      SELECT 1 FROM project_tool pt WHERE pt.project_id = p.id
                  )
                """, String.class);

        assertThat(projectsWithoutTool)
                .as("projets visibles sans aucun outil")
                .isEmpty();
    }

    @Test
    void featuredProjectsAreVisible() {
        List<String> hiddenFeaturedProjects = jdbc.queryForList("""
                SELECT slug
                FROM project
                WHERE featured AND NOT visible
                """, String.class);

        assertThat(hiddenFeaturedProjects)
                .as("projets mis en avant mais masqués")
                .isEmpty();
    }

    @Test
    void profileHasExactlyOneRow() {
        Integer count = jdbc.queryForObject("SELECT count(*) FROM profile", Integer.class);

        assertThat(count)
                .as("nombre de lignes dans la table profile")
                .isEqualTo(1);
    }
}
