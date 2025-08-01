package com.urlshortener.service;

import com.urlshortener.dto.ShortenUrlRequest;
import com.urlshortener.dto.ShortenUrlResponse;
import com.urlshortener.dto.UrlStatsResponse;
import com.urlshortener.exception.CustomValidationException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.model.Click;
import com.urlshortener.model.Url;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.urlshortener.util.ShortCodeGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final ShortCodeGenerator shortCodeGenerator;

    @Value("${server.port}")
    private String serverPort; // Assuming backend runs on 8080 by default

    public UrlService(UrlRepository urlRepository, ShortCodeGenerator shortCodeGenerator) {
        this.urlRepository = urlRepository;
        this.shortCodeGenerator = shortCodeGenerator;
    }

    @Transactional
    public ShortenUrlResponse createShortUrl(ShortenUrlRequest request, HttpServletRequest httpRequest) {
        String originalUrl = request.getUrl();
        Integer validityMinutes = Optional.ofNullable(request.getValidity()).orElse(30); // Default to 30 minutes

        if (validityMinutes <= 0) {
            throw new CustomValidationException("Validity must be a positive integer.");
        }

        String shortCode = request.getShortcode();

        if (shortCode != null && !shortCodeGenerator.isValidCustomShortCode(shortCode)) {
            throw new CustomValidationException("Custom shortcode format is invalid.");
        }

        if (shortCode != null) {
            // Check if custom shortcode already exists
            if (urlRepository.findByShortCode(shortCode).isPresent()) {
                throw new CustomValidationException("Custom shortcode '" + shortCode + "' is already in use.");
            }
        } else {
            // Generate unique shortcode
            do {
                shortCode = shortCodeGenerator.generateUniqueShortCode();
            } while (urlRepository.findByShortCode(shortCode).isPresent());
        }

        LocalDateTime creationDate = LocalDateTime.now();
        LocalDateTime expiryDate = creationDate.plusMinutes(validityMinutes);

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortCode);
        url.setCreationDate(creationDate);
        url.setExpiryDate(expiryDate);

        urlRepository.save(url);

        // Construct the full shortlink
        String shortlink = String.format("http://localhost:%s/%s", serverPort, shortCode); // Adjust if deployed

        return ShortenUrlResponse.builder()
                .shortlink(shortlink)
                .expiry(expiryDate.atOffset(ZoneOffset.UTC)) // ISO 8601 formatted
                .build();
    }

    @Transactional
    public String redirectToOriginalUrl(String shortCode, HttpServletRequest httpRequest) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found."));

        if (url.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new CustomValidationException("Short link has expired.");
        }

        // Record click data
        Click click = new Click();
        click.setTimestamp(LocalDateTime.now());
        click.setSource(httpRequest.getHeader("Referer")); // Get referrer
        // Geo-location is complex. This is a placeholder. You'd use a service like MaxMind GeoLite2
        click.setGeoLocationCity("");
        click.setGeoLocationCountry("");
        click.setGeoLocationLatitude("");
        click.setGeoLocationLongitude("");

        url.addClick(click); // Add click to the list managed by JPA
        urlRepository.save(url); // Save the URL to persist the new click

        return url.getOriginalUrl();
    }

    public UrlStatsResponse getUrlStatistics(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found."));

        return UrlStatsResponse.builder()
                .totalClicks(url.getClicks().size())
                .originalUrlInfo(UrlStatsResponse.OriginalUrlInfo.builder()
                        .originalUrl(url.getOriginalUrl())
                        .creationDate(url.getCreationDate().atOffset(ZoneOffset.UTC))
                        .expiryDate(url.getExpiryDate().atOffset(ZoneOffset.UTC))
                        .build())
                .detailedClicks(url.getClicks().stream().map(click -> UrlStatsResponse.DetailedClick.builder()
                        .timestamp(click.getTimestamp().atOffset(ZoneOffset.UTC))
                        .source(click.getSource())
                        .geoLocation(UrlStatsResponse.GeoLocation.builder()
                                .city(click.getGeoLocationCity())
                                .country(click.getGeoLocationCountry())
                                .latitude(click.getGeoLocationLatitude())
                                .longitude(click.getGeoLocationLongitude())
                                .build())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}