package com.luchrist.portfolio.profile;

import java.util.List;

import com.luchrist.portfolio.common.LocalizedText;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private static final short PROFILE_ID = 1;

    private final ProfileRepository profiles;
    private final SocialLinkRepository socialLinks;
    private final BioParagraphRepository bioParagraphs;
    private final ProfileValueRepository values;
    private final ProfileItemRepository items;
    private final SpokenLanguageRepository languages;

    public ProfileService(ProfileRepository profiles,
                          SocialLinkRepository socialLinks,
                          BioParagraphRepository bioParagraphs,
                          ProfileValueRepository values,
                          ProfileItemRepository items,
                          SpokenLanguageRepository languages) {
        this.profiles = profiles;
        this.socialLinks = socialLinks;
        this.bioParagraphs = bioParagraphs;
        this.values = values;
        this.items = items;
        this.languages = languages;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        Profile profile = profiles.findById(PROFILE_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Profil introuvable"));

        return new ProfileResponse(
                profile.getFullName(),
                profile.getBrand(),
                profile.getPhotoUrl(),
                profile.getWebsiteUrl(),
                profile.getLocation(),
                new ProfileResponse.Availability(
                        profile.getAvailabilityStatus(),
                        profile.getAvailabilityLabel()),
                socialLinks.findAllByOrderByPositionAsc().stream()
                        .map(ProfileResponse.SocialLinkResponse::from)
                        .toList(),
                profile.getSlogan(),
                profile.getDescription(),
                bioParagraphs.findAllByOrderByPositionAsc().stream()
                        .map(BioParagraph::getText)
                        .toList(),
                values.findAllByOrderByPositionAsc().stream()
                        .map(ProfileResponse.ValueResponse::from)
                        .toList(),
                labelsOf("quality"),
                labelsOf("interest"),
                languages.findAllByOrderByPositionAsc().stream()
                        .map(ProfileResponse.LanguageResponse::from)
                        .toList(),
                new ProfileResponse.Company(
                        profile.getCompanyName(),
                        profile.getCompanyRole(),
                        profile.getCompanyDescription())
        );
    }

    // Qualités et centres d'intérêt vivent dans la même table : on filtre par "kind".
    private List<LocalizedText> labelsOf(String kind) {
        return items.findByKindOrderByPositionAsc(kind).stream()
                .map(ProfileItem::getLabel)
                .toList();
    }
}
