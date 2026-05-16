package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.*;
import com.gradnexa.wear.service.AuthService;
import com.gradnexa.wear.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemDto>>> getCart() {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(authService.getCurrentUser())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemDto>> addToCart(@Valid @RequestBody CartRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.addToCart(authService.getCurrentUser(), request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemDto>> updateQuantity(
            @PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.updateQuantity(authService.getCurrentUser(), id, body.get("quantity"))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable Long id) {
        cartService.removeFromCart(authService.getCurrentUser(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed", null));
    }

    @GetMapping("/total")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotal() {
        return ResponseEntity.ok(ApiResponse.success(
                cartService.getCartTotal(authService.getCurrentUser())));
    }
}
