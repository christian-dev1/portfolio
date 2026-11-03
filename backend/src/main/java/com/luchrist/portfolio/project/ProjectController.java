package com.luchrist.portfolio.project;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> listVisibleProjects() {
        return projectService.findVisibleProjects();
    }

    // NOUVEAU : /api/projects/{id}, par exemple /api/projects/superapp
    @GetMapping("/{id}")
    public ProjectResponse getProject(@PathVariable String id) {
        return projectService.findVisibleProject(id);
    }
}
