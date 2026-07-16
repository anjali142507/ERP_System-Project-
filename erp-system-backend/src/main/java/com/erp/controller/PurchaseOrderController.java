package com.erp.controller;

import com.erp.entity.PurchaseOrder;
import com.erp.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:3000") //
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService service;

    @PostMapping
    public PurchaseOrder create(@RequestBody PurchaseOrder order){
        return service.save(order);
    }

    @GetMapping
    public List<PurchaseOrder> getAll(){
        return service.getAll();
    }

    @PutMapping("/{id}/status")
    public PurchaseOrder updateStatus(@PathVariable Long id, @RequestBody String status){
        return service.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) { // 👈 ("id") zaroori hai
        service.delete(id);
    }
}
