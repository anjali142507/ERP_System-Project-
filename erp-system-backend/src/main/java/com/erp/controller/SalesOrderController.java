package com.erp.controller;

import com.erp.entity.SalesOrder;
import com.erp.service.SalesOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
public class SalesOrderController {

    @Autowired
    private SalesOrderService service;

    // ✅ Create Order
    @PostMapping
    public SalesOrder createOrder(@RequestBody SalesOrder order) {
        return service.save(order);
    }

    // ✅ Get All Orders
    @GetMapping
    public List<SalesOrder> getAllOrders() {
        return service.getAll();
    }

    // ✅ Delete Order
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        service.delete(id);
        return "Order Deleted Successfully";
    }

    // ✅ Update Status
    @PutMapping("/{id}/status")
    public SalesOrder updateStatus(@PathVariable Long id,
                                   @RequestParam String status) {
        return service.updateStatus(id, status);
    }
}