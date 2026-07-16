package com.erp.service;

import com.erp.entity.Grn;
import com.erp.entity.Product;
import com.erp.repository.GrnRepository;
import com.erp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrnService {

    @Autowired
    private GrnRepository repo;

    @Autowired
    private ProductRepository productRepo;
    // GrnService.java ke andar jahan error hai
    public Grn save(Grn grn) {
        // Agar aap yahan koi logic laga rahe hain:
        if (grn.getItems() != null) { // 👈 getProductsReceived() ko getItems() se badlein
            // Aapka logic yahan aayega
        }
        return repo.save(grn);
    }
    // GrnService.java ke andar add karein
    // GrnService.java
    public Grn update(Long id, Grn updatedGrn) {
        Grn existingGrn = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("GRN #" + id + " nahi mila!"));

        // Anjali, yahan dhyan dena: fields vahi rakho jo Grn.java mein hain
        existingGrn.setPoNumber(updatedGrn.getPoNumber());
        existingGrn.setReceivedDate(updatedGrn.getReceivedDate());
        existingGrn.setReceivedBy(updatedGrn.getReceivedBy());
        existingGrn.setStatus(updatedGrn.getStatus());
        existingGrn.setItems(updatedGrn.getItems());

        return repo.save(existingGrn);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("GRN record nahi mila!");
        }

        // 1. Pehle child table (grn_items) se records saaf karein
        repo.deleteItemsByGrnId(id);

        // 2. Ab main GRN table (grns) se record delete karein
        repo.deleteById(id);

        System.out.println("GRN #" + id + " and its items are deleted!");
    }
    public List<Grn> getAll(){
        return repo.findAll();
    }
}
