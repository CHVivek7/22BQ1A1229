package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ShortenUrlRequest {
    @NotBlank(message = "URL is required")
    @Pattern(regexp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]", message = "Invalid URL format")
    private String url;

    @Min(value = 1, message = "Validity must be a positive integer")
    private Integer validity; // In minutes, optional

    // Custom shortcode, optional, should be validated in service layer as well
    // Consider adding a @Pattern here too, but validation needs to check uniqueness in DB
    private String shortcode;
}