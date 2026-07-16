package com.erp.controller;

import com.erp.dto.LoginRequest;
import com.erp.dto.LoginResponse;
import com.erp.entity.User;
import com.erp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user){
        return authService.register(user);
    }

    // 🔥 LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.login(request.getUsername(), request.getPassword());
    }
}