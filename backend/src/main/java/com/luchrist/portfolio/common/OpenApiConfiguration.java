package com.luchrist.portfolio.common;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "LUCHRIST Portfolio API", version = "2.0.0",
        description = "Public portfolio content and contact API."),
        servers = @Server(url = "/", description = "Current host"), tags = {
        @Tag(name = "Profile"),
        @Tag(name = "Projects"),
        @Tag(name = "Tools"),
        @Tag(name = "Career"),
        @Tag(name = "Contact")
})
public class OpenApiConfiguration {
}
