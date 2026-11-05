package com.luchrist.portfolio.project;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProjectService {

    private final ProjectRepository projects;

    public ProjectService(ProjectRepository projects) {
        this.projects = projects;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findVisibleProjects() {
        return projects.findByVisibleTrueOrderByPositionAsc().stream()
                .map(ProjectResponse::from)
                .toList();
    }

    // NOUVEAU : un seul projet, ou une erreur 404
    @Transactional(readOnly = true)
    public ProjectResponse findVisibleProject(String slug) {
        return projects.findBySlugAndVisibleTrue(slug)
                .map(ProjectResponse::from)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Projet introuvable : " + slug));
    }
}
