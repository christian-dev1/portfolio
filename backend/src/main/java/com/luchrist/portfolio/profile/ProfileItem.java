package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Qualité ou centre d'intérêt (colonne "kind" : quality / interest). */
@Entity
@Table(name = "profile_item")
public class ProfileItem {

    @Id
    private Long id;

    private String kind;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "label_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "label_en"))
    private LocalizedText label;

    private Short position;

    protected ProfileItem() {
    }

    public String getKind() { return kind; }
    public LocalizedText getLabel() { return label; }
}
