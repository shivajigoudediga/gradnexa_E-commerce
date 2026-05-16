package com.gradnexa.wear.service;

import com.gradnexa.wear.dto.*;
import com.gradnexa.wear.entity.*;
import com.gradnexa.wear.exception.BadRequestException;
import com.gradnexa.wear.exception.ResourceNotFoundException;
import com.gradnexa.wear.repository.CouponRepository;
import com.gradnexa.wear.repository.OrderRepository;
import com.gradnexa.wear.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final CouponRepository couponRepository;
    private final ProductRepository productRepository;

    private static final BigDecimal SHIPPING_FEE = new BigDecimal("99.00");
    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("999.00");

    @Transactional
    public OrderDto createOrder(User user, CheckoutRequest request) {
        List<CartItemDto> cartItems = cartService.getCart(user);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal subtotal = cartItems.stream()
                .map(CartItemDto::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            discount = applyCoupon(request.getCouponCode(), subtotal);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_FEE;
        BigDecimal total = subtotal.add(shippingFee).subtract(discount);

        Order order = Order.builder()
                .orderNumber("GNX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discount(discount)
                .total(total)
                .couponCode(request.getCouponCode())
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingFullName(request.getShippingFullName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddressLine1(request.getShippingAddressLine1())
                .shippingAddressLine2(request.getShippingAddressLine2())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingPostalCode(request.getShippingPostalCode())
                .shippingCountry(request.getShippingCountry())
                .build();

        for (CartItemDto cartItem : cartItems) {
            Product product = productService.findById(cartItem.getProductId());
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName());
            }
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(product.getId())
                    .productName(product.getName())
                    .productImage(cartItem.getProductImage())
                    .size(cartItem.getSize())
                    .color(cartItem.getColor())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPrice())
                    .total(cartItem.getTotal())
                    .build();
            order.getItems().add(orderItem);
        }

        Order saved = orderRepository.save(order);
        return toDto(saved);
    }

    @Transactional
    public OrderDto confirmPayment(String orderNumber, String razorpayOrderId,
                                    String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setRazorpayOrderId(razorpayOrderId);
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setRazorpaySignature(razorpaySignature);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);

        for (OrderItem item : order.getItems()) {
            Product product = productService.findById(item.getProductId());
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            product.setSoldCount(product.getSoldCount() + item.getQuantity());
            productRepository.save(product);
        }

        cartService.clearCart(order.getUser());
        return toDto(orderRepository.save(order));
    }

    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrder(String orderNumber) {
        return toDto(orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public OrderDto updateOrderStatus(Long orderId, OrderStatus status, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        if (trackingNumber != null) order.setTrackingNumber(trackingNumber);
        return toDto(orderRepository.save(order));
    }

    private BigDecimal applyCoupon(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code.toUpperCase())
                .orElseThrow(() -> new BadRequestException("Invalid coupon code"));

        if (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Coupon expired");
        }
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount not met");
        }

        BigDecimal discount;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = coupon.getDiscountValue();
        }
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        return discount;
    }

    public OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .size(item.getSize())
                        .color(item.getColor())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .total(item.getTotal())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .items(items)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discount(order.getDiscount())
                .total(order.getTotal())
                .couponCode(order.getCouponCode())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .shippingFullName(order.getShippingFullName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddressLine1(order.getShippingAddressLine1())
                .shippingAddressLine2(order.getShippingAddressLine2())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPostalCode(order.getShippingPostalCode())
                .shippingCountry(order.getShippingCountry())
                .trackingNumber(order.getTrackingNumber())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
