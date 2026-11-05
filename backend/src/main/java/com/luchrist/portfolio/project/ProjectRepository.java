package com.luchrist.portfolio.project;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByVisibleTrueOrderByPositionAsc();

    // NOUVEAU : un seul projet, cherché par son slug, et seulement s'il est visible
    Optional<Project> findBySlugAndVisibleTrue(String slug);
}
