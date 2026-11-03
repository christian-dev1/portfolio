package com.luchrist.portfolio.project;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_highlight")
public class ProjectHighlight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id")
    private Project project;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "text_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "text_en"))
    private LocalizedText text;

    private Short position;

    protected ProjectHighlight() {
    }

    public Long getId() { return id; }
    public LocalizedText getText() { return text; }
    public Short getPosition() { return position; }
}
