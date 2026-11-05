package com.luchrist.portfolio.career;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "career_entry")
public class CareerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    private String type;
    private Short startYear;
    private Short endYear;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "title_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "title_en"))
    private LocalizedText title;

    private String place;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "description_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "description_en"))
    private LocalizedText description;

    private boolean visible;
    private Short position;

    protected CareerEntry() {
    }

    public String getSlug() {
        return slug;
    }

    public String getType() {
        return type;
    }

    public Short getStartYear() {
        return startYear;
    }

    public Short getEndYear() {
        return endYear;
    }

    public LocalizedText getTitle() {
        return title;
    }

    public String getPlace() {
        return place;
    }

    public LocalizedText getDescription() {
        return description;
    }

    public boolean isVisible() {
        return visible;
    }

    public Short getPosition() {
        return position;
    }
}
