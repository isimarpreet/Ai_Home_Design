package net.aihomedesign.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> analyzeRoomImage(String imagePath) throws IOException {
       //image coversion
        File imageFile = new File(imagePath);
        byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        //Ai prompt
        String prompt = "Analyze this image and provide a detailed room description in the format: 'ROOM DESCRIPTION: {description}'. "
               + "Then, suggest 14-15 renovation ideas in the format: 'RENOVATION IDEAS: {list of ideas}'. "
               + "Each suggestion should have a title and estimated cost.";


       
        // ✅ Corrected Request Payload Format
        Map<String, Object> imagePart = new HashMap<>();
        imagePart.put("mimeType", "image/jpeg");
        imagePart.put("data", base64Image);

        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        parts.add(Map.of("inlineData", imagePart));  // 

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(Map.of("parts", parts))
        );

        // ✅ Set HTTP Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
      

        // ✅ Append API Key to URL
        String requestUrl = apiUrl + "?key=" + apiKey;

        // ✅ Send Request to Gemini API
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(requestUrl, requestEntity, String.class);

        // ✅ Return AI-generated response
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("ai_response", response.getBody());

        return responseData;
    }
}
