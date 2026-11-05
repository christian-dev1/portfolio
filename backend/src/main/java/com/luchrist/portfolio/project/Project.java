package com.luchrist.portfolio.project;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.luchrist.portfolio.common.LocalizedText;
import com.luchrist.portfolio.tool.Tool;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
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

    // NOUVEAU : un projet -> plusieurs points forts, triés par position
    @OneToMany(mappedBy = "project")
    @OrderBy("position ASC")
    private List<ProjectHighlight> highlights = new ArrayList<>();

    // NOUVEAU : de simples mots (Backend, Frontend, QA) stockés dans project_role
    @ElementCollection
    @CollectionTable(name = "project_role", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "role")
    @OrderBy
    private Set<String> roles = new LinkedHashSet<>();

    // NOUVEAU : plusieurs projets <-> plusieurs outils, via la table de liaison project_tool
    @ManyToMany
    @JoinTable(
            name = "project_tool",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "tool_id"))
    @OrderBy("id ASC")
    private List<Tool> tools = new ArrayList<>();

    protected Project() {
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public LocalizedText getSummary() {
        return summary;
    }

    public LocalizedText getCoverTagline() {
        return coverTagline;
    }

    public String getContext() {
        return context;
    }

    public String getStatus() {
        return status;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public boolean isVisible() {
        return visible;
    }

    public boolean isFeatured() {
        return featured;
    }

    public Short getPosition() {
        return position;
    }

    public List<ProjectHighlight> getHighlights() {
        return highlights;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public List<Tool> getTools() {
        return tools;
    }
}
