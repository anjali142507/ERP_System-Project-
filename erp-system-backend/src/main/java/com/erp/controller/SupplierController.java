package com.erp.controller;

import com.erp.entity.Supplier;
import com.erp.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:3000")
public class SupplierController {

    @Autowired
    private SupplierService service;

    @PostMapping
    public Supplier add(@RequestBody Supplier s) {
        return service.save(s);
    }

    @GetMapping
    public List<Supplier> getAll() {
        return service.getAll();
    }

    // 👇 Ye method missing hoga, ise add kijiye
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}