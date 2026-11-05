package com.luchrist.portfolio.common;

import java.util.Locale;
import java.util.TreeMap;

import com.luchrist.portfolio.contact.ContactRateLimitException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return handleExceptionInternal(exception, validationProblem(exception.getBindingResult()), headers, status, request);
    }

    @ExceptionHandler(BindException.class)
    public ProblemDetail binding(BindException exception) {
        return validationProblem(exception.getBindingResult());
    }

    private ProblemDetail validationProblem(BindingResult validation) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Request validation failed");
        var errors = new TreeMap<String, String>();
        validation.getFieldErrors().forEach(error -> errors.merge(error.getField(),
                error.getCode() == null ? "invalid" : error.getCode().toLowerCase(Locale.ROOT),
                (first, second) -> first.compareTo(second) <= 0 ? first : second));
        problem.setProperty("errors", errors);
        return problem;
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return handleExceptionInternal(exception, ProblemDetail.forStatusAndDetail(status, "Unreadable JSON request"),
                headers, status, request);
    }

    @ExceptionHandler(ContactRateLimitException.class)
    public ResponseEntity<ProblemDetail> rateLimit(ContactRateLimitException exception) {
        return ResponseEntity.status(429).header(HttpHeaders.RETRY_AFTER, Long.toString(exception.getRetryAfter()))
                .body(ProblemDetail.forStatusAndDetail(HttpStatus.TOO_MANY_REQUESTS, "Contact rate limit exceeded"));
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail unexpected(Exception exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
}
