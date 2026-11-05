package com.luchrist.portfolio.contact;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(

        @NotBlank
        @Size(min = 2, max = 80)
        String name,

        @NotBlank
        @Size(max = 254)
        @Pattern(regexp = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        String email,

        @NotBlank
        @Size(min = 10, max = 2000)
        String message,

        // Case piège invisible pour un humain : un robot la coche.
        Boolean botcheck
) {

    // Constructeur compact : s'exécute à la création, AVANT la validation.
    public ContactRequest {
        name = strip(name);
        email = strip(email);
        message = strip(message);
    }

    public boolean isRobot() {
        return Boolean.TRUE.equals(botcheck);
    }

    private static String strip(String value) {
        return value == null ? null : value.strip();
    }
}
