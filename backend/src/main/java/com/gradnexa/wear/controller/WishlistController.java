package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.ApiResponse;
import com.gradnexa.wear.dto.ProductDto;
import com.gradnexa.wear.service.AuthService;
import com.gradnexa.wear.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getWishlist() {
        return ResponseEntity.ok(ApiResponse.success(
                wishlistService.getWishlist(authService.getCurrentUser())));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> add(@PathVariable Long productId) {
        wishlistService.addToWishlist(authService.getCurrentUser(), productId);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", null));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(authService.getCurrentUser(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }
}
