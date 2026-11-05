package com.luchrist.portfolio.profile;

import com.luchrist.portfolio.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
class ProfileServiceTests {

    @Autowired
    private ProfileService profileService;

    @Test
    void assemblesTheWholeProfile() {
        ProfileResponse profile = profileService.getProfile();

        assertThat(profile.fullName()).isNotBlank();
        assertThat(profile.websiteUrl()).isNull();

        assertThat(profile.socialLinks()).hasSize(9);
        assertThat(profile.socialLinks().get(0).network()).isEqualTo("linkedin");

        assertThat(profile.bio()).hasSize(2);
        assertThat(profile.values()).hasSize(4);
        assertThat(profile.values().get(0).id()).isEqualTo("dare");
        assertThat(profile.qualities()).hasSize(4);
        assertThat(profile.interests()).hasSize(5);
        assertThat(profile.languages()).hasSize(2);

        assertThat(profile.company().name()).isEqualTo("B-HER EMPIRE");
    }
}
