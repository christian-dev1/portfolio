package com.luchrist.portfolio.contact;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(

        @Schema(example = "Awa Mballa")
        @NotBlank
        @Size(min = 2, max = 80)
        String name,

        @Schema(example = "awa@example.com")
        @NotBlank
        @Size(max = 254)
        @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        String email,

        @Schema(example = "Bonjour, j'aimerais échanger au sujet d'un stage.")
        @NotBlank
        @Size(min = 10, max = 2000)
        String message,

        // Case piège invisible pour un humain : un robot la coche.
        @Schema(example = "false")
        Boolean botcheck
) {

    // Constructeur compact : s'exécute à la création, AVANT la validation.
    public ContactRequest {
        name = strip(name);
        email = strip(email);
        message = strip(message);
    }

    // Pas une propriété JSON : ni lue, ni écrite, ni documentée.
    @JsonIgnore
    public boolean isRobot() {
        return Boolean.TRUE.equals(botcheck);
    }

    private static String strip(String value) {
        return value == null ? null : value.strip();
    }
}
