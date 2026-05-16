package com.gradnexa.wear.service;

import com.gradnexa.wear.dto.DashboardStatsDto;
import com.gradnexa.wear.entity.Order;
import com.gradnexa.wear.entity.PaymentStatus;
import com.gradnexa.wear.entity.User;
import com.gradnexa.wear.repository.OrderRepository;
import com.gradnexa.wear.repository.ProductRepository;
import com.gradnexa.wear.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public DashboardStatsDto getDashboardStats() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);

        List<Order> allOrders = orderRepository.findAll();
        List<Map<String, Object>> recentOrders = allOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(5)
                .map(o -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("orderNumber", o.getOrderNumber());
                    m.put("total", o.getTotal());
                    m.put("status", o.getStatus());
                    m.put("createdAt", o.getCreatedAt());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> topProducts = productRepository.findTopSelling().stream()
                .limit(5)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("name", p.getName());
                    m.put("soldCount", p.getSoldCount());
                    m.put("price", p.getPrice());
                    return m;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> monthlySales = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = LocalDateTime.now().minusMonths(i).withDayOfMonth(1);
            LocalDateTime end = start.plusMonths(1);
            BigDecimal revenue = allOrders.stream()
                    .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                    .filter(o -> o.getCreatedAt().isAfter(start) && o.getCreatedAt().isBefore(end))
                    .map(Order::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            Map<String, Object> m = new HashMap<>();
            m.put("month", start.getMonth().name());
            m.put("revenue", revenue);
            m.put("orders", allOrders.stream()
                    .filter(o -> o.getCreatedAt().isAfter(start) && o.getCreatedAt().isBefore(end))
                    .count());
            monthlySales.add(m);
        }

        return DashboardStatsDto.builder()
                .totalRevenue(orderRepository.getTotalRevenue())
                .monthlyRevenue(orderRepository.getRevenueSince(monthStart))
                .totalOrders(orderRepository.count())
                .monthlyOrders(orderRepository.countOrdersSince(monthStart))
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .topProducts(topProducts)
                .monthlySales(monthlySales)
                .recentOrders(recentOrders)
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleBlockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.gradnexa.wear.exception.ResourceNotFoundException("User not found"));
        user.setBlocked(!user.isBlocked());
        return userRepository.save(user);
    }
}
