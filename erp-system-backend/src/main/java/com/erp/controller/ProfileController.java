package com.erp.controller;

import com.erp.entity.User;
import com.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @PostMapping("/upload/{id}")
    public User uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        User user = userRepository.findById(id).orElseThrow();

        String uploadDir = "uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.write(path, file.getBytes());

        user.setProfileImage(fileName);

        return userRepository.save(user);
    }

}