package com.gradnexa.wear.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private List<String> images;
    private List<String> sizes;
    private List<String> colors;
    private String fabric;
    private String shippingInfo;
    private int stockQuantity;
    private double rating;
    private int reviewCount;
    private int soldCount;
    private boolean trending;
    private boolean featured;
}
