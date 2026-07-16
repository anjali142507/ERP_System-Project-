package com.erp.controller;

import com.erp.entity.Product;
import com.erp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Frontend se connect karne ke liye zaroori h
public class ProductController {

    @Autowired
    ProductService productService;

    @GetMapping
    public List<Product> getProducts(){
        return productService.getAllProducts();
    }

    // 🔥 FIX: Ise {id} wale raste se pehle rakhein
    @GetMapping("/count")
    public long getProductCount() {
        return productService.getAllProducts().size();
        // Note: Performance ke liye baad mein productService.count() bana lena
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product){
        return productService.saveProduct(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product){
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }
}