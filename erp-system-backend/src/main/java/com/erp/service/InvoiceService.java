package com.erp.service;

import com.erp.entity.Invoice;
import com.erp.entity.SalesOrder;
import com.erp.repository.InvoiceRepository;
import com.erp.repository.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository repo;

    @Autowired
    private SalesOrderRepository salesOrderRepo;

    public Invoice generateFromSalesOrder(Long salesOrderId){
        SalesOrder order = salesOrderRepo.findById(salesOrderId).orElseThrow();
        Invoice invoice = new Invoice();
        invoice.setCustomerName(order.getCustomerName());
        invoice.setSalesOrderId(salesOrderId);
        invoice.setTax(order.getTotalAmount() * 0.18); // 18% GST
        invoice.setTotalPayable(order.getTotalAmount() + invoice.getTax());
        invoice.setStatus("Unpaid");
        return repo.save(invoice);
    }
    @Autowired
    private InvoiceRepository invoiceRepository;

    public boolean deleteById(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Invoice> getAll(){
        return repo.findAll();
    }

    public Invoice save(Invoice invoice){
        return repo.save(invoice);
    }

    // InvoiceService.java mein ye method add karein
    public Invoice update(Long id, Invoice details) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        invoice.setCustomerName(details.getCustomerName());
        invoice.setDate(details.getDate());
        invoice.setDueDate(details.getDueDate());
        invoice.setAmount(details.getAmount());
        invoice.setTax(details.getTax());
        invoice.setTotalPayable(details.getTotalPayable());
        invoice.setStatus(details.getStatus());

        return invoiceRepository.save(invoice);
    }
}
