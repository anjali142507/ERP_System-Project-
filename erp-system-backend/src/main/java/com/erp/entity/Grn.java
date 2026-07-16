package com.erp.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "grns") // Database table 'grns' se match karega
public class Grn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // React: poNumber bhej raha hai
    private String poNumber;

    // React: receivedDate bhej raha hai
    private String receivedDate;

    private String receivedBy;
    private String status;

    // React: items bhej raha hai (Pipe separated strings)
    @ElementCollection
    @CollectionTable(name = "grn_items", joinColumns = @JoinColumn(name = "grn_id"))
    private List<String> items;

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPoNumber() { return poNumber; }
    public void setPoNumber(String poNumber) { this.poNumber = poNumber; }

    public String getReceivedDate() { return receivedDate; }
    public void setReceivedDate(String receivedDate) { this.receivedDate = receivedDate; }

    public String getReceivedBy() { return receivedBy; }
    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getItems() { return items; }
    public void setItems(List<String> items) { this.items = items; }
}