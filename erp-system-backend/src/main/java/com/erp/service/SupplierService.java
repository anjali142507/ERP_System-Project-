package com.erp.service;

import com.erp.entity.Supplier;
import com.erp.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository repo; // Check karlein aapne 'repo' hi naam rakha hai na?

    public Supplier
    save(Supplier s) {
        return repo.save(s);
    }

    public List<Supplier> getAll() {
        return repo.findAll();
    }

    // 👇 Ye add kijiye
    public void delete(Long id) {
        repo.deleteById(id);
    }
}