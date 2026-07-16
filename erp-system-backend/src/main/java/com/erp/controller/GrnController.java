package com.erp.controller;

import com.erp.entity.Grn;
import com.erp.service.GrnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/grns")
@CrossOrigin(origins = "http://localhost:3000") // 👈 Iske bina React request block hogi
public class GrnController {
    @Autowired
    private GrnService service;

    @PostMapping
    public Grn create(@RequestBody Grn grn) {
        return service.save(grn);
    }
    @PutMapping("/{id}")
    public Grn update(@PathVariable("id") Long id, @RequestBody Grn grn) {
        return service.update(id, grn);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }
    // ... baaki methods
    @GetMapping
    public List<Grn> getAll(){
        return service.getAll();
    }
}
