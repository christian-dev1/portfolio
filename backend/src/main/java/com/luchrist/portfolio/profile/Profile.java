package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.common.LocalizedText;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "profile")
public class Profile {

    /** Toujours 1 : la base garantit qu'il n'existe qu'un seul profil. */
    @Id
    private Short id;

    private String fullName;
    private String brand;
    private String photoUrl;
    private String websiteUrl;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "location_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "location_en"))
    private LocalizedText location;

    private String availabilityStatus;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "availability_label_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "availability_label_en"))
    private LocalizedText availabilityLabel;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "slogan_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "slogan_en"))
    private LocalizedText slogan;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "description_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "description_en"))
    private LocalizedText description;

    private String companyName;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "company_role_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "company_role_en"))
    private LocalizedText companyRole;

    @Embedded
    @AttributeOverride(name = "fr", column = @Column(name = "company_description_fr"))
    @AttributeOverride(name = "en", column = @Column(name = "company_description_en"))
    private LocalizedText companyDescription;

    protected Profile() {
    }

    public String getFullName() { return fullName; }
    public String getBrand() { return brand; }
    public String getPhotoUrl() { return photoUrl; }
    public String getWebsiteUrl() { return websiteUrl; }
    public LocalizedText getLocation() { return location; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public LocalizedText getAvailabilityLabel() { return availabilityLabel; }
    public LocalizedText getSlogan() { return slogan; }
    public LocalizedText getDescription() { return description; }
    public String getCompanyName() { return companyName; }
    public LocalizedText getCompanyRole() { return companyRole; }
    public LocalizedText getCompanyDescription() { return companyDescription; }
}
