package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.*;
import com.gradnexa.wear.service.AuthService;
import com.gradnexa.wear.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.createOrder(authService.getCurrentUser(), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders() {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getUserOrders(authService.getCurrentUser())));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrder(orderNumber)));
    }
}
