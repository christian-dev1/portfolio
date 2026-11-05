package com.luchrist.portfolio.contact;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.headers.Header;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ProblemDetail;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Contact")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @Operation(summary = "Send a contact message", responses = {
            @ApiResponse(responseCode = "202", description = "Message accepted", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid request",
                    content = @Content(mediaType = "application/problem+json",
                            schema = @Schema(implementation = ProblemDetail.class))),
            @ApiResponse(responseCode = "429", description = "Contact rate limit exceeded",
                    headers = @Header(name = "Retry-After", description = "Seconds until another attempt is allowed",
                            schema = @Schema(type = "integer", format = "int64")),
                    content = @Content(mediaType = "application/problem+json",
                            schema = @Schema(implementation = ProblemDetail.class)))
    })
    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void send(@Valid @RequestBody ContactRequest request,
                     org.springframework.validation.BindingResult validation,
                     jakarta.servlet.http.HttpServletRequest servletRequest)
            throws org.springframework.validation.BindException {
        if (request.isRobot()) return;
        if (validation.hasErrors()) {
            throw new org.springframework.validation.BindException(validation);
        }
        contactService.receive(request, servletRequest.getRemoteAddr());
    }
}
