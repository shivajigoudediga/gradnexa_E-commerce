package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.ApiResponse;
import com.gradnexa.wear.dto.OrderDto;
import com.gradnexa.wear.dto.PaymentVerifyRequest;
import com.gradnexa.wear.service.OrderService;
import com.gradnexa.wear.service.PaymentService;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @PostMapping("/create/{orderNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createPayment(@PathVariable String orderNumber)
            throws RazorpayException {
        return ResponseEntity.ok(ApiResponse.success(paymentService.createRazorpayOrder(orderNumber)));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<OrderDto>> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        boolean valid = paymentService.verifyPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        if (!valid) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment verification failed"));
        }

        OrderDto order = orderService.confirmPayment(
                request.getOrderNumber(),
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        return ResponseEntity.ok(ApiResponse.success("Payment successful", order));
    }
}
