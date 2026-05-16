package com.gradnexa.wear.dto;

import com.gradnexa.wear.entity.OrderStatus;
import com.gradnexa.wear.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDto {
    private Long id;
    private String orderNumber;
    private List<OrderItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal total;
    private String couponCode;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String shippingFullName;
    private String shippingPhone;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPostalCode;
    private String shippingCountry;
    private String trackingNumber;
    private LocalDateTime createdAt;
}
