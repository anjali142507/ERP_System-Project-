package com.erp.service;

import com.erp.repository.ProductRepository;
import com.erp.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public Product saveProduct(Product product){
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product){

        Product p = productRepository.findById(id).orElseThrow();

        p.setName(product.getName());
        p.setCategory(product.getCategory());
        p.setUnitPrice(product.getUnitPrice());

        return productRepository.save(p);
    }
    public Product getProductById(Long id){
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }
}