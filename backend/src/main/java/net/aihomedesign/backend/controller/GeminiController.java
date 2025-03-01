package net.aihomedesign.backend.controller; // ✅ Ensure correct package

import net.aihomedesign.backend.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/gemini") 
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // ✅ FIXED: Ensure proper endpoint mapping
    @GetMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeRoom(@RequestParam String imageName) {
        try {
            String imagePath = "uploads/" + imageName;
            Map<String, Object> response = geminiService.analyzeRoomImage(imagePath);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error processing image."));
        }
    }
}
