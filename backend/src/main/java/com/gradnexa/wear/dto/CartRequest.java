package com.gradnexa.wear.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartRequest {
    @NotNull
    private Long productId;
    private String size;
    private String color;
    @Min(1)
    private int quantity = 1;
}
