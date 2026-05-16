package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.ApiResponse;
import com.gradnexa.wear.dto.ReviewDto;
import com.gradnexa.wear.dto.ReviewRequest;
import com.gradnexa.wear.service.AuthService;
import com.gradnexa.wear.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getProductReviews(productId)));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.addReview(authService.getCurrentUser(), productId, request)));
    }
}
