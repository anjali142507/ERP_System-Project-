package com.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private Long salesOrderId;

    // 💡 In do fields ko badlein/add karein taaki React se match ho
    private String date;         // React 'date' expect kar raha hai
    private String dueDate;      // React 'dueDate' expect kar raha hai
    private Double amount;       // React 'amount' expect kar raha hai

    private Double tax;
    private Double totalPayable;
    private String status;       // Paid, Unpaid

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getSalesOrderId() { return salesOrderId; }
    public void setSalesOrderId(Long salesOrderId) { this.salesOrderId = salesOrderId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotalPayable() { return totalPayable; }
    public void setTotalPayable(Double totalPayable) { this.totalPayable = totalPayable; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}