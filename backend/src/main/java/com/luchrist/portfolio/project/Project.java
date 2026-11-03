package com.luchrist.portfolio.project;

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
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "summary_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "summary_en"))
    private LocalizedText summary;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "cover_tagline_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "cover_tagline_en"))
    private LocalizedText coverTagline;

    private String context;
    private String status;
    private String repositoryUrl;
    private String logoUrl;
    private String coverUrl;
    private boolean visible;
    private boolean featured;
    private Short position;

    /** Constructeur exigé par JPA, inutilisable ailleurs. */
    protected Project() {
    }

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public String getName() { return name; }
    public LocalizedText getSummary() { return summary; }
    public LocalizedText getCoverTagline() { return coverTagline; }
    public String getContext() { return context; }
    public String getStatus() { return status; }
    public String getRepositoryUrl() { return repositoryUrl; }
    public String getLogoUrl() { return logoUrl; }
    public String getCoverUrl() { return coverUrl; }
    public boolean isVisible() { return visible; }
    public boolean isFeatured() { return featured; }
    public Short getPosition() { return position; }
}
