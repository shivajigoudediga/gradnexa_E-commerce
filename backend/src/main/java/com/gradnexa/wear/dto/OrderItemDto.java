package com.gradnexa.wear.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String size;
    private String color;
    private int quantity;
    private BigDecimal price;
    private BigDecimal total;
}
