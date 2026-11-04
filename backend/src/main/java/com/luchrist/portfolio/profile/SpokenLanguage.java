package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "spoken_language")
public class SpokenLanguage {

    @Id
    private Long id;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "name_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "name_en"))
    private LocalizedText name;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "level_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "level_en"))
    private LocalizedText level;

    private Short position;

    protected SpokenLanguage() {
    }

    public LocalizedText getName() { return name; }
    public LocalizedText getLevel() { return level; }
}
