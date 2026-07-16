package com.erp.service;

import com.erp.entity.Customer;
import com.erp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo; // Aapka variable 'repo' hai

    public Customer save(Customer c){
        return repo.save(c);
    }

    public List<Customer> getAll(){
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id); // 👈 Yahan 'repository' ki jagah 'repo' likhiye
    }
}