package com.gradnexa.wear.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequest {
    @NotBlank
    private String shippingFullName;
    @NotBlank
    private String shippingPhone;
    @NotBlank
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    @NotBlank
    private String shippingCity;
    @NotBlank
    private String shippingState;
    @NotBlank
    private String shippingPostalCode;
    private String shippingCountry = "India";
    private String couponCode;
}
