package com.erp.service;

import com.erp.entity.Product;
import com.erp.entity.SalesOrder;
import com.erp.repository.ProductRepository;
import com.erp.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalesOrderService {

    @Autowired
    private SalesOrderRepository repo;

    @Autowired
    private ProductRepository productRepo;

    // ✅ Create Order
    @Transactional
    public SalesOrder save(SalesOrder order) {

        if (order.getProductId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        Product product = productRepo.findById(order.getProductId())
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        if (order.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (product.getCurrentStock() < order.getQuantity()) {
            throw new RuntimeException("Insufficient Stock!");
        }

        // ✅ Deduct stock
        product.setCurrentStock(product.getCurrentStock() - order.getQuantity());
        productRepo.save(product);

        // ✅ Set default date
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }

        return repo.save(order);
    }

    // ✅ Delete Order (FIXED 🔥)
    @Transactional
    public void delete(Long id) {

        SalesOrder order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        // ✅ Refund stock safely
        if (order.getProductId() != null && order.getQuantity() > 0) {

            Product product = productRepo.findById(order.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setCurrentStock(product.getCurrentStock() + order.getQuantity());
            productRepo.save(product);
        }

        // ✅ Delete order safely
        repo.delete(order);
    }

    // ✅ Get All Orders
    public List<SalesOrder> getAll() {
        return repo.findAll();
    }

    // ✅ Update Status
    public SalesOrder updateStatus(Long id, String status) {

        SalesOrder order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        if (status == null || status.isEmpty()) {
            throw new RuntimeException("Status cannot be empty");
        }

        order.setStatus(status);
        System.out.println("Saving Order for: " + order.getCustomerName());
        return repo.save(order);
    }
}