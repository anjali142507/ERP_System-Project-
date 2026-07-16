package com.erp.controller;

import com.erp.entity.Customer;
import com.erp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") // Agar CORS issue aaye toh
public class CustomerController {

    @Autowired
    private CustomerService service;

    @PostMapping
    public Customer add(@RequestBody Customer c){
        return service.save(c);
    }

    @GetMapping
    public List<Customer> getAll(){
        return service.getAll();
    }

    // 👇 Ye method add kijiye delete ke liye
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}