package com.erp.controller;

import com.erp.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin; // 👈 Ye import check karein
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000") // 👈 Ye line login aur stats dono ke liye zaroori hai
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping("/sales-summary")
    public Map<String, Object> getSalesSummary() {
        return service.getSalesSummary();
    }

    @GetMapping("/stock-alerts")
    public Map<String, Object> getStockAlerts() {
        return service.getStockAlerts();
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return service.getDashboardStats();
    }

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        return service.getDashboardSummary();
    }
}
