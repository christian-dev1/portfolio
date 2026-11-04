package com.luchrist.portfolio.profile;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luchrist.portfolio.common.LocalizedText;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProfileResponse(
        String fullName,
        String brand,
        String photoUrl,
        String websiteUrl,
        LocalizedText location,
        Availability availability,
        List<SocialLinkResponse> socialLinks,
        LocalizedText slogan,
        LocalizedText description,
        List<LocalizedText> bio,
        List<ValueResponse> values,
        List<LocalizedText> qualities,
        List<LocalizedText> interests,
        List<LanguageResponse> languages,
        Company company
) {

    // "availability": { "status": ..., "label": { fr, en } }
    public record Availability(String status, LocalizedText label) {}

    // "socialLinks": [ { "network": ..., "url": ... } ]
    public record SocialLinkResponse(String network, String url) {
        static SocialLinkResponse from(SocialLink link) {
            return new SocialLinkResponse(link.getNetwork(), link.getUrl());
        }
    }

    // "values": [ { "id": ..., "title": {..}, "text": {..} } ]
    public record ValueResponse(String id, LocalizedText title, LocalizedText text) {
        static ValueResponse from(ProfileValue value) {
            return new ValueResponse(value.getSlug(), value.getTitle(), value.getText());
        }
    }

    // "languages": [ { "name": {..}, "level": {..} } ]
    public record LanguageResponse(LocalizedText name, LocalizedText level) {
        static LanguageResponse from(SpokenLanguage language) {
            return new LanguageResponse(language.getName(), language.getLevel());
        }
    }

    // "company": { "name": ..., "role": {..}, "description": {..} }
    public record Company(String name, LocalizedText role, LocalizedText description) {}
}
