package com.gradnexa.wear.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private long totalOrders;
    private long monthlyOrders;
    private long totalUsers;
    private long totalProducts;
    private List<Map<String, Object>> topProducts;
    private List<Map<String, Object>> monthlySales;
    private List<Map<String, Object>> recentOrders;
}
