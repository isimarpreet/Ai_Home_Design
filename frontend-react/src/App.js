import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [roomDescription, setRoomDescription] = useState(""); // Holds the AI-generated room description
  const [suggestions, setSuggestions] = useState([]); // Holds AI-generated renovation suggestions
  const [error, setError] = useState("");

  // Handles file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Uploads image to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.text();
      if (response.ok) {
        alert("Image uploaded successfully!");
        fetchSuggestions(selectedFile.name);
      } else {
        setError("Error uploading image: " + data);
      }
    } catch (error) {
      setError("Failed to upload image: " + error.message);
    }
  };

  // Fetches AI renovation suggestions after image upload
  const fetchSuggestions = async (imageName) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/gemini/analyze?imageName=${imageName}`
      );

      const data = await response.json();

      if (response.ok) {
        processSuggestions(data.ai_response);
      } else {
        setError("Error fetching AI suggestions.");
      }
    } catch (error) {
      setError("Failed to fetch AI suggestions: " + error.message);
    }
  };

  // Processes AI response and extracts room description + renovation ideas
  const processSuggestions = (aiResponse) => {
    try {
      const jsonString = aiResponse.replace(/\n/g, ""); // Clean new lines
      const parsedData = JSON.parse(jsonString);

      const aiText = parsedData.candidates[0].content.parts[0].text;

      // Extract Room Description
      const roomDescMatch = aiText.match(/ROOM DESCRIPTION:(.*?)RENOVATION IDEAS:/s);
      const roomDesc = roomDescMatch ? roomDescMatch[1].trim() : "No description found.";
      setRoomDescription(roomDesc);

      // Extract Renovation Suggestions
      const suggestionsList = aiText
        .split("\n")
        .filter((line) => line.includes("**")) // Select lines with bold text
        .map((line) => line.replace(/\*\*/g, "").trim());

      setSuggestions(suggestionsList);
    } catch (error) {
      setError("Error processing AI response");
    }
  };

  return (
    <div className="App">
      <h2>Upload a Picture of Your Room</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      {previewUrl && (
        <div>
          <h3>Image Preview:</h3>
          <img src={previewUrl} alt="Preview" width="400px" />
        </div>
      )}

      {roomDescription && (
        <div>
          <h3>Room Description:</h3>
          <p>{roomDescription}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h3>AI Renovation Suggestions:</h3>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <input type="checkbox" /> {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
