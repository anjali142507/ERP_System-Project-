package com.erp.controller;

import com.erp.entity.Invoice;
import com.erp.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {

    @Autowired
    private InvoiceService service; // Hum isi service ko use karenge

    @PostMapping("/generate/{salesOrderId}")
    public Invoice generate(@PathVariable("salesOrderId") Long salesOrderId) {
        return service.generateFromSalesOrder(salesOrderId);
    }

    @PostMapping
    public Invoice create(@RequestBody Invoice invoice){
        return service.save(invoice);
    }

    @GetMapping
    public List<Invoice> getAll(){
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvoice(@PathVariable("id") Long id) {
        try {
            // ✅ Service check karegi ki record hai ya nahi
            boolean isDeleted = service.deleteById(id);

            if (isDeleted) {
                return ResponseEntity.ok().body("Invoice deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Invoice not found with id: " + id);
            }
        } catch (Exception e) {
            // 💡 Agar Foreign Key constraint error aayi toh ye execute hoga
            return ResponseEntity.status(400).body("Cannot delete: This invoice is linked to other records.");
        }
    }
    // InvoiceController.java mein baaki methods ke saath ye bhi add karein
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable("id") Long id, @RequestBody Invoice invoiceDetails) {
        try {
            Invoice updatedInvoice = service.update(id, invoiceDetails);
            return ResponseEntity.ok(updatedInvoice);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }
}