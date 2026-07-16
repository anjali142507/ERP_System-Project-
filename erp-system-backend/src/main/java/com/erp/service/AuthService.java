package com.erp.service;

import com.erp.dto.LoginResponse;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import com.erp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // REGISTER
    public User register(User user){
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public LoginResponse login(String username, String password){
        User user = userRepository.findFirstByUsername(username).orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid Credentials");
        }

        if (encoder.matches(password, user.getPassword())){
            return new LoginResponse(jwtUtil.generateToken(username), user);
        }

        throw new RuntimeException("Invalid Credentials");
    }
}