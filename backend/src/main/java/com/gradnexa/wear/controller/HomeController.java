package com.gradnexa.wear.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "app", "GradNexa Wear API",
                "status", "running",
                "message", "This is the backend API. Open the website at http://localhost:5173",
                "docs", Map.of(
                        "products", "/api/products",
                        "featured", "/api/products/featured",
                        "health", "/api/health"
                )
        );
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
