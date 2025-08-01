package com.urlshortener.urlshortener.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;

@Component
public class ShortCodeGenerator {
    private static final int SHORTCODE_LENGTH = 7; // Example length

    public String generateUniqueShortCode() {
        // Generates a random alphanumeric string
        return RandomStringUtils.randomAlphanumeric(SHORTCODE_LENGTH);
    }

    public boolean isValidCustomShortCode(String shortCode) {
        // Add more robust validation if needed (e.g., regex for specific chars)
        return shortCode != null && shortCode.matches("^[a-zA-Z0-9_$-]{3,20}$"); // Example: 3-20 alphanumeric, _, $, -
    }
}