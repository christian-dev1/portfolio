package com.luchrist.portfolio.project;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Projects")
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(summary = "List visible projects")
    @GetMapping
    public List<ProjectResponse> listVisibleProjects() {
        return projectService.findVisibleProjects();
    }

    // NOUVEAU : /api/projects/{id}, par exemple /api/projects/superapp
    @Operation(summary = "Get a visible project by its slug", responses = {
            @ApiResponse(responseCode = "200", description = "Visible project found"),
            @ApiResponse(responseCode = "404", description = "Project not found or not visible",
                    content = @Content(mediaType = "application/problem+json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    @GetMapping("/{id}")
    public ProjectResponse getProject(@Parameter(description = "Project slug, e.g. wimo") @PathVariable String id) {
        return projectService.findVisibleProject(id);
    }
}
