package com.luchrist.portfolio.project;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
