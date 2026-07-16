package com.erp.service;

import com.erp.entity.Product;
import com.erp.entity.SalesOrder;
import com.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.erp.entity.PurchaseOrder;

@Service
public class DashboardService {

        @Autowired
        private SalesOrderRepository salesOrderRepo;

        @Autowired
        private ProductRepository productRepo;

        @Autowired
        private CustomerRepository customerRepo; // 👈 Ye missing ho sakta hai

        @Autowired
        private GrnRepository grnRepo;           // 👈 Ye missing ho sakta hai

        @Autowired
        private InvoiceRepository invoiceRepo;   // 👈 Ye missing ho sakta hai

        @Autowired
        private SupplierRepository supplierRepo;

        @Autowired
        private PurchaseOrderRepository purchaseOrderRepo;

        // ... baki ka code

    public Map<String, Object> getSalesSummary() {
        List<SalesOrder> orders = salesOrderRepo.findAll();
        double totalSales = orders.stream().mapToDouble(SalesOrder::getTotalAmount).sum();
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("orderCount", orders.size());
        return summary;
    }

    public Map<String, Object> getStockAlerts() {
        List<Product> products = productRepo.findAll();
        List<Product> lowStock = products.stream()
                .filter(p -> p.getCurrentStock() <= p.getReorderLevel())
                .toList();
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("lowStockProducts", lowStock);
        return alerts;
    }

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalProducts", productRepo.count());
        stats.put("totalCustomers", customerRepo.count());
        stats.put("totalGrns", grnRepo.count());
        stats.put("totalInvoices", invoiceRepo.count());
        return stats;
    }
    public Map<String, Object> getDashboardSummary() {

        Map<String, Object> summary = new HashMap<>();

        // Total Sales
        List<SalesOrder> salesOrders = salesOrderRepo.findAll();
        double totalSales = salesOrders.stream()
                .mapToDouble(SalesOrder::getTotalAmount)
                .sum();

        summary.put("totalSales", totalSales);

        // Total Purchases (Amount)
        List<PurchaseOrder> purchaseOrders = purchaseOrderRepo.findAll();
        double totalPurchases = purchaseOrders.stream()
                .mapToDouble(PurchaseOrder::getTotalAmount)
                .sum();

        summary.put("totalPurchases", totalPurchases);

        // Pending Invoices
        summary.put("pendingInvoices", invoiceRepo.count());

        // Low Stock Count
        long lowStockCount = productRepo.findAll()
                .stream()
                .filter(product -> product.getCurrentStock() <= product.getReorderLevel())
                .count();

        summary.put("lowStockCount", lowStockCount);

        // Recent GRNs
        summary.put("recentGrnCount", grnRepo.count());

        // Top Selling Product (Temporary)
        summary.put("topProduct", "N/A");

        return summary;
    }
}