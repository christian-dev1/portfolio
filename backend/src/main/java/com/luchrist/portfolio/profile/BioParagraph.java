package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bio_paragraph")
public class BioParagraph {

    @Id
    private Long id;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "text_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "text_en"))
    private LocalizedText text;

    private Short position;

    protected BioParagraph() {
    }

    public LocalizedText getText() { return text; }
}
