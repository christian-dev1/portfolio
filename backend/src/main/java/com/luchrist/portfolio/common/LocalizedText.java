package com.luchrist.portfolio.common;

import jakarta.persistence.Embeddable;

/** Texte bilingue : correspond aux paires de colonnes *_fr / *_en et au JSON { "fr": …, "en": … }. */
@Embeddable
public record LocalizedText(String fr, String en) {
}
