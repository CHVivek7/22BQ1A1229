package com.urlshortener.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "urls") // Avoid conflict with SQL keyword 'URL'
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Url {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048) // Max length for URLs
    private String originalUrl;

    @Column(nullable = false, unique = true, length = 20) // Ensure shortcode uniqueness
    private String shortCode;

    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Click> clicks = new ArrayList<>();

    // Helper method to add clicks
    public void addClick(Click click) {
        clicks.add(click);
        click.setUrl(this);
    }
}