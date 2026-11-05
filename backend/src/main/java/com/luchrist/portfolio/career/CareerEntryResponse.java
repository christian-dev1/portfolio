package com.luchrist.portfolio.career;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luchrist.portfolio.common.LocalizedText;

/** Entrée de parcours au format JSON attendu par le frontend (identique à career.json). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CareerEntryResponse(
        String id,
        String type,
        Short startYear,
        Short endYear,
        LocalizedText title,
        String place,
        LocalizedText description,
        boolean visible) {

    static CareerEntryResponse from(CareerEntry entry) {
        return new CareerEntryResponse(
                entry.getSlug(),
                entry.getType(),
                entry.getStartYear(),
                entry.getEndYear(),
                entry.getTitle(),
                entry.getPlace(),
                entry.getDescription(),
                entry.isVisible());
    }
}
