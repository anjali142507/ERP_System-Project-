package com.erp.service;

import com.erp.repository.PurchaseOrderRepository;
import com.erp.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private SalesOrderRepository salesRepo;
    @Autowired
    private PurchaseOrderRepository purchaseRepo;

    public Map<String, Object> calculateSummary() {
        // SQL query se total nikalna (Example logic)
        Double totalSales = salesRepo.findAll().stream().mapToDouble(s -> s.getTotalAmount()).sum();
        Double totalPurchases = purchaseRepo.findAll().stream().mapToDouble(p -> p.getTotalAmount()).sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalSales", totalSales);
        response.put("totalPurchases", totalPurchases);
        response.put("netProfit", totalSales - totalPurchases);

        // Chart ke liye monthly data (Static example, ise aap DB se fetch kar sakti hain)
        response.put("salesByMonth", List.of(
                Map.of("month", "Feb", "sales", 4000, "purchases", 2400, "profit", 1600),
                Map.of("month", "Apr", "sales", 3000, "purchases", 8000, "profit", -5000),
                Map.of("month", "Jun", "sales", 2000, "purchases", 4800, "profit", -2800)
        ));

        return response;
    }
}
