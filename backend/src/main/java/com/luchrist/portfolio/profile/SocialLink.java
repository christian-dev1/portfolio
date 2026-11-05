package com.luchrist.portfolio.profile;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "social_link")
public class SocialLink {

    @Id
    private Long id;

    private String network;
    private String url;
    private Short position;

    protected SocialLink() {
    }

    public String getNetwork() {
        return network;
    }

    public String getUrl() {
        return url;
    }
}
