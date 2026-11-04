package com.luchrist.portfolio.tool;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luchrist.portfolio.common.LocalizedText;
import com.luchrist.portfolio.project.Project;

/** Outil au format JSON attendu par le frontend (identique à tools.json). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ToolResponse(
        String id,
        LocalizedText name,
        String icon,
        String monogram,
        String category,
        List<LocalizedText> usedIn,
        boolean visible) {

    static ToolResponse from(Tool tool) {
        return new ToolResponse(
                tool.getSlug(),
                tool.getName(),
                tool.getIcon(),
                tool.getMonogram(),
                tool.getCategory(),
                usedIn(tool),
                tool.isVisible());
    }

    /** Projets visibles utilisant l'outil, puis la note d'usage éventuelle (« Usage quotidien »…). */
    private static List<LocalizedText> usedIn(Tool tool) {
        List<LocalizedText> usages = new ArrayList<>();
        for (Project project : tool.getProjects()) {
            if (project.isVisible()) {
                usages.add(new LocalizedText(project.getName(), project.getName()));
            }
        }
        if (tool.getUsageNote() != null) {
            usages.add(tool.getUsageNote());
        }
        return usages;
    }
}
