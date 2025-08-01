package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class UrlStatsResponse {
    private long totalClicks;
    private OriginalUrlInfo originalUrlInfo;
    private List<DetailedClick> detailedClicks;

    @Data
    @Builder
    public static class OriginalUrlInfo {
        private String originalUrl;
        private OffsetDateTime creationDate;
        private OffsetDateTime expiryDate;
    }

    @Data
    @Builder
    public static class DetailedClick {
        private OffsetDateTime timestamp;
        private String source;
        private GeoLocation geoLocation;
    }

    @Data
    @Builder
    public static class GeoLocation {
        private String latitude;
        private String longitude;
        private String city;
        private String country;
    }
}