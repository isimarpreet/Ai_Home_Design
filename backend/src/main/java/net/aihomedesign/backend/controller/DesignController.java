package net.aihomedesign.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
@RestController
@RequestMapping("/api")
public class DesignController {

    // ✅ Test API to check if backend is running
    @GetMapping("/test")
    public String testAPI() {
        return "Backend is working!";
    }

    // ✅ API to upload images
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No image uploaded.");
        }

        try {
            // Define upload directory
            String uploadDir = new File("uploads").getAbsolutePath() + "/";
            System.out.println("Saving image to: " + uploadDir);

            // Create folder if not exists
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // Save image
            File uploadedFile = new File(uploadDir + image.getOriginalFilename());
            image.transferTo(uploadedFile);

            return ResponseEntity.ok("Image uploaded successfully: " + image.getOriginalFilename());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image: " + e.getMessage());
        }
    }
}
