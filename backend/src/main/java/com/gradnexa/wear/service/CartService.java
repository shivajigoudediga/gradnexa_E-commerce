package com.gradnexa.wear.service;

import com.gradnexa.wear.dto.CartItemDto;
import com.gradnexa.wear.dto.CartRequest;
import com.gradnexa.wear.entity.CartItem;
import com.gradnexa.wear.entity.Product;
import com.gradnexa.wear.entity.User;
import com.gradnexa.wear.exception.BadRequestException;
import com.gradnexa.wear.exception.ResourceNotFoundException;
import com.gradnexa.wear.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public List<CartItemDto> getCart(User user) {
        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CartItemDto addToCart(User user, CartRequest request) {
        Product product = productService.findById(request.getProductId());
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }

        String size = request.getSize() != null ? request.getSize() : "";
        String color = request.getColor() != null ? request.getColor() : "";

        CartItem item = cartItemRepository
                .findByUserIdAndProductIdAndSizeAndColor(user.getId(), product.getId(), size, color)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .size(size)
                        .color(color)
                        .quantity(0)
                        .build());

        item.setQuantity(item.getQuantity() + request.getQuantity());
        return toDto(cartItemRepository.save(item));
    }

    public CartItemDto updateQuantity(User user, Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return toDto(cartItemRepository.save(item));
    }

    public void removeFromCart(User user, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }
        cartItemRepository.delete(item);
    }

    public void clearCart(User user) {
        cartItemRepository.deleteByUserId(user.getId());
    }

    public BigDecimal getCartTotal(User user) {
        return getCart(user).stream()
                .map(CartItemDto::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private CartItemDto toDto(CartItem item) {
        Product p = item.getProduct();
        BigDecimal total = p.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemDto.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImage(p.getImages().isEmpty() ? null : p.getImages().get(0))
                .price(p.getPrice())
                .size(item.getSize())
                .color(item.getColor())
                .quantity(item.getQuantity())
                .total(total)
                .stockQuantity(p.getStockQuantity())
                .build();
    }
}
