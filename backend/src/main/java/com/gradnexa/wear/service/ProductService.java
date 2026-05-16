package com.gradnexa.wear.service;

import com.gradnexa.wear.dto.ProductDto;
import com.gradnexa.wear.dto.ProductRequest;
import com.gradnexa.wear.entity.Category;
import com.gradnexa.wear.entity.Product;
import com.gradnexa.wear.exception.ResourceNotFoundException;
import com.gradnexa.wear.repository.CategoryRepository;
import com.gradnexa.wear.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getProducts(Long categoryId, String categorySlug, BigDecimal minPrice,
                                         BigDecimal maxPrice, Boolean trending, String search, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.isActive())
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasCategorySlug(categorySlug))
                .and(ProductSpecification.priceBetween(minPrice, maxPrice))
                .and(ProductSpecification.isTrending(trending))
                .and(ProductSpecification.searchByName(search));

        return productRepository.findAll(spec, pageable).map(this::toDto);
    }

    public ProductDto getProduct(Long id) {
        return toDto(findById(id));
    }

    public List<ProductDto> getFeatured() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getTrending() {
        return productRepository.findByTrendingTrueAndActiveTrue().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getRelated(Long productId, Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(4)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<String> getSearchSuggestions(String query) {
        return productRepository.searchProducts(query).stream()
                .limit(8)
                .map(Product::getName)
                .collect(Collectors.toList());
    }

    public ProductDto createProduct(ProductRequest request) {
        Product product = mapToEntity(new Product(), request);
        return toDto(productRepository.save(product));
    }

    public ProductDto updateProduct(Long id, ProductRequest request) {
        Product product = findById(id);
        mapToEntity(product, request);
        return toDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = findById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private Product mapToEntity(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCompareAtPrice(request.getCompareAtPrice());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getSizes() != null) product.setSizes(request.getSizes());
        if (request.getColors() != null) product.setColors(request.getColors());
        product.setFabric(request.getFabric());
        product.setShippingInfo(request.getShippingInfo());
        product.setStockQuantity(request.getStockQuantity());
        product.setTrending(request.isTrending());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());
        return product;
    }

    public ProductDto toDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .compareAtPrice(product.getCompareAtPrice())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .images(product.getImages())
                .sizes(product.getSizes())
                .colors(product.getColors())
                .fabric(product.getFabric())
                .shippingInfo(product.getShippingInfo())
                .stockQuantity(product.getStockQuantity())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .soldCount(product.getSoldCount())
                .trending(product.isTrending())
                .featured(product.isFeatured())
                .build();
    }
}
