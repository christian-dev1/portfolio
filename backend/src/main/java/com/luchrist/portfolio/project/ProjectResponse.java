package com.luchrist.portfolio.project;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luchrist.portfolio.common.LocalizedText;

/** Projet au format JSON attendu par le frontend (identique à projects.json). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProjectResponse(
        String id,
        String name,
        LocalizedText summary,
        List<LocalizedText> highlights,
        LocalizedText coverTagline,
        String context,
        List<String> roles,
        List<String> technologies,
        String status,
        String repositoryUrl,
        String logoUrl,
        String coverUrl,
        boolean visible,
        boolean featured) {

    static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getSlug(),
                project.getName(),
                project.getSummary(),
                project.getHighlights().stream().map(ProjectHighlight::getText).toList(),
                project.getCoverTagline(),
                project.getContext(),
                List.copyOf(project.getRoles()),
                project.getTools().stream().map(tool -> tool.getName().fr()).toList(),
                project.getStatus(),
                project.getRepositoryUrl(),
                project.getLogoUrl(),
                project.getCoverUrl(),
                project.isVisible(),
                project.isFeatured());
    }
}
