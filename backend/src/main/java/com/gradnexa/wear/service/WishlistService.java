package com.gradnexa.wear.service;

import com.gradnexa.wear.dto.ProductDto;
import com.gradnexa.wear.entity.Product;
import com.gradnexa.wear.entity.User;
import com.gradnexa.wear.entity.WishlistItem;
import com.gradnexa.wear.exception.BadRequestException;
import com.gradnexa.wear.exception.ResourceNotFoundException;
import com.gradnexa.wear.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductService productService;

    public List<ProductDto> getWishlist(User user) {
        return wishlistItemRepository.findByUserId(user.getId()).stream()
                .map(item -> productService.toDto(item.getProduct()))
                .collect(Collectors.toList());
    }

    public void addToWishlist(User user, Long productId) {
        if (wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("Product already in wishlist");
        }
        Product product = productService.findById(productId);
        wishlistItemRepository.save(WishlistItem.builder().user(user).product(product).build());
    }

    public void removeFromWishlist(User user, Long productId) {
        WishlistItem item = wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));
        wishlistItemRepository.delete(item);
    }
}
