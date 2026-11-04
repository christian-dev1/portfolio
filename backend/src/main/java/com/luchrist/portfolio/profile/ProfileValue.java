package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "profile_value")
public class ProfileValue {

    @Id
    private Long id;

    private String slug;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "title_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "title_en"))
    private LocalizedText title;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "text_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "text_en"))
    private LocalizedText text;

    private Short position;

    protected ProfileValue() {
    }

    public String getSlug() { return slug; }
    public LocalizedText getTitle() { return title; }
    public LocalizedText getText() { return text; }
}
