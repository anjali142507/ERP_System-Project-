package com.erp.service;

import com.erp.entity.PurchaseOrder;
import com.erp.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository repo;

    public PurchaseOrder save(PurchaseOrder order){
        order.setStatus("Ordered");
        return repo.save(order);
    }

    public List<PurchaseOrder> getAll(){
        return repo.findAll();
    }

    public PurchaseOrder updateStatus(Long id, String status){
        PurchaseOrder order = repo.findById(id).orElseThrow();
        order.setStatus(status);
        return repo.save(order);
    }
    // PurchaseOrderService.java ke andar add karein
    public void delete(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        } else {
            throw new RuntimeException("Purchase Order nahi mila!");
        }
    }
}
