package com.gradnexa.wear.config;

import com.gradnexa.wear.entity.*;
import com.gradnexa.wear.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = User.builder()
                .email("admin@gradnexa.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("GradNexa")
                .role(Role.ROLE_ADMIN)
                .build();

        User user = User.builder()
                .email("user@gradnexa.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("Demo")
                .lastName("User")
                .phone("9876543210")
                .role(Role.ROLE_USER)
                .build();

        userRepository.saveAll(List.of(admin, user));

        List<Category> categories = List.of(
                Category.builder().name("Anime Collection").slug("anime").description("Premium anime printed tees").build(),
                Category.builder().name("Oversized Tees").slug("oversized").description("Comfort oversized fits").build(),
                Category.builder().name("Hoodies").slug("hoodies").description("Premium streetwear hoodies").build(),
                Category.builder().name("Coding Collection").slug("coding").description("Dev life apparel").build(),
                Category.builder().name("Motivational Quotes").slug("motivational").description("Wear your mindset").build(),
                Category.builder().name("Streetwear").slug("streetwear").description("Urban fashion essentials").build()
        );
        categoryRepository.saveAll(categories);

        String img = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600";

        List<Product> products = Arrays.asList(
                buildProduct("Naruto Sage Mode Tee", "Premium DTF printed anime tee with vibrant colors.", new BigDecimal("899"),
                        categories.get(0), img, List.of("S","M","L","XL","XXL"), List.of("Black","Navy"), true, true, 50),
                buildProduct("Gojo Infinity Hoodie", "Ultra-soft fleece hoodie with Gojo Satoru graphic.", new BigDecimal("1899"),
                        categories.get(2), img, List.of("M","L","XL"), List.of("Black","Purple"), true, true, 30),
                buildProduct("Code. Coffee. Repeat.", "For developers who live in the terminal.", new BigDecimal("799"),
                        categories.get(3), img, List.of("S","M","L","XL"), List.of("Black","White"), true, false, 75),
                buildProduct("Hustle Harder Oversized", "Motivational quote on premium oversized cotton.", new BigDecimal("999"),
                        categories.get(4), img, List.of("M","L","XL","XXL"), List.of("Black","Grey"), false, true, 40),
                buildProduct("Street Vibes Cargo Tee", "Urban streetwear with bold graphic print.", new BigDecimal("849"),
                        categories.get(5), img, List.of("S","M","L","XL"), List.of("Black","Olive"), true, false, 60),
                buildProduct("Demon Slayer Tanjiro Tee", "High-quality DTF print of Tanjiro Kamado.", new BigDecimal("899"),
                        categories.get(0), img, List.of("S","M","L","XL"), List.of("Black","Red"), true, true, 45),
                buildProduct("React Dev Hoodie", "Built with React. Worn with pride.", new BigDecimal("1799"),
                        categories.get(3), img, List.of("M","L","XL"), List.of("Black","Blue"), false, true, 25),
                buildProduct("No Limits Oversized", "Break barriers. Wear confidence.", new BigDecimal("949"),
                        categories.get(4), img, List.of("M","L","XL","XXL"), List.of("Black","White"), true, true, 35)
        );
        productRepository.saveAll(products);

        Coupon coupon = Coupon.builder()
                .code("GRADNEXA10")
                .description("10% off on all orders")
                .discountType(Coupon.DiscountType.PERCENTAGE)
                .discountValue(new BigDecimal("10"))
                .minOrderAmount(new BigDecimal("500"))
                .validFrom(LocalDateTime.now().minusDays(1))
                .validUntil(LocalDateTime.now().plusMonths(6))
                .usageLimit(1000)
                .active(true)
                .build();
        couponRepository.save(coupon);
    }

    private Product buildProduct(String name, String desc, BigDecimal price, Category cat,
                                  String img, List<String> sizes, List<String> colors,
                                  boolean trending, boolean featured, int stock) {
        return Product.builder()
                .name(name)
                .description(desc)
                .price(price)
                .compareAtPrice(price.add(new BigDecimal("200")))
                .category(cat)
                .images(List.of(img))
                .sizes(sizes)
                .colors(colors)
                .fabric("100% Premium Cotton, 180 GSM")
                .shippingInfo("Ships in 3-5 business days. Free shipping above ₹999.")
                .stockQuantity(stock)
                .rating(4.5)
                .reviewCount(12)
                .soldCount((int)(Math.random() * 100))
                .trending(trending)
                .featured(featured)
                .active(true)
                .build();
    }
}
