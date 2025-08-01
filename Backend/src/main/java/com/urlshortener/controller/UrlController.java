package com.urlshortener.controller;

import com.urlshortener.dto.ShortenUrlRequest;
import com.urlshortener.dto.ShortenUrlResponse;
import com.urlshortener.dto.UrlStatsResponse;
import com.urlshortener.exception.CustomValidationException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Ensure CORS for frontend
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    // MANDATORY LOGGING INTEGRATION: Replace System.out.println with calls to the pre-test setup's Logging Middleware
    // This is a placeholder for demonstration purposes.
    private void logToCustomSystem(String message) {
        // In a real scenario, this would call a static method or an injected service
        // from your pre-test setup's Logging Middleware.
        System.out.println("Custom Log: " + message); // REMOVE FOR FINAL SUBMISSION
    }

    @PostMapping("/api/shorturls")
    public ResponseEntity<ShortenUrlResponse> createShortUrl(
            @Valid @RequestBody ShortenUrlRequest request,
            HttpServletRequest httpRequest) {
        logToCustomSystem("API Call: POST /api/shorturls - Request: " + request.getUrl());
        ShortenUrlResponse response = urlService.createShortUrl(request, httpRequest);
        logToCustomSystem("API Call: POST /api/shorturls - Response: " + response.getShortlink());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/shorturls/{shortcode}")
    public ResponseEntity<UrlStatsResponse> getUrlStatistics(
            @PathVariable String shortcode) {
        logToCustomSystem("API Call: GET /api/shorturls/" + shortcode);
        UrlStatsResponse response = urlService.getUrlStatistics(shortcode);
        logToCustomSystem("API Call: GET /api/shorturls/" + shortcode + " - Clicks: " + response.getTotalClicks());
        return ResponseEntity.ok(response);
    }

    // Redirection endpoint - important to place at root level for cleaner URLs
    @GetMapping("/{shortcode}")
    public ResponseEntity<Void> redirectToOriginalUrl(
            @PathVariable String shortcode,
            HttpServletRequest httpRequest) {
        logToCustomSystem("Redirecting: /" + shortcode);
        String originalUrl = urlService.redirectToOriginalUrl(shortcode, httpRequest);
        // Use 302 Found for temporary redirect, 301 Moved Permanently if links never change
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", originalUrl)
                .build();
    }

    // Global Exception Handler for validation errors
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        logToCustomSystem("Validation Error: " + errors);
        return errors;
    }

    // Exception Handler for custom validation errors (e.g., shortcode exists)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(CustomValidationException.class)
    public Map<String, String> handleCustomValidationException(CustomValidationException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ex.getMessage());
        logToCustomSystem("Custom Validation Error: " + ex.getMessage());
        return errors;
    }

    // Exception Handler for not found resources
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ex.getMessage());
        logToCustomSystem("Resource Not Found Error: " + ex.getMessage());
        return errors;
    }

    // Generic Exception Handler for other errors
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public Map<String, String> handleGeneralException(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "An unexpected error occurred: " + ex.getMessage());
        logToCustomSystem("Internal Server Error: " + ex.getMessage());
        ex.printStackTrace(); // For debugging, remove or replace with custom logging in production
        return errors;
    }
}