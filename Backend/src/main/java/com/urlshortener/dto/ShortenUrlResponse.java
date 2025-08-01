package com.urlshortener.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class ShortenUrlResponse {
    private String shortlink;
    private OffsetDateTime expiry;
}