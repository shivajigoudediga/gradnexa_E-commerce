package com.gradnexa.wear.repository;

import com.gradnexa.wear.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndProductIdAndSizeAndColor(Long userId, Long productId, String size, String color);
    void deleteByUserId(Long userId);
}
