package com.luchrist.portfolio.tool;

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
@Table(name = "tool")
public class Tool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "name_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "name_en"))
    private LocalizedText name;

    private String icon;
    private String monogram;
    private String category;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "usage_note_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "usage_note_en"))
    private LocalizedText usageNote;

    private boolean visible;
    private Short position;

    protected Tool() {
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public LocalizedText getName() { return name; }
    public String getIcon() { return icon; }
    public String getMonogram() { return monogram; }
    public String getCategory() { return category; }
    public LocalizedText getUsageNote() { return usageNote; }
    public boolean isVisible() { return visible; }
    public Short getPosition() { return position; }
}
