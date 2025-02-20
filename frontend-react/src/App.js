import React, { useState } from 'react';
import './App.css';

function App() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [design, setDesign] = useState({
    wallColor: false,
    sofa: false,
    lights: false,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setDesign({ ...design, [name]: checked });
  };

  const showSelected = () => {
    alert(
      `Selected Designs:\n
      Wall Color: ${design.wallColor ? 'Light Blue' : 'No Change'}\n
      Sofa: ${design.sofa ? 'Modern Leather' : 'No Change'}\n
      Lights: ${design.lights ? 'LED Panels' : 'No Change'}`
    );
  };

  return (
    <div className="App">
      <h2>Upload a Picture of Your Room</h2>
      <input type="file" onChange={handleFileChange} />
      <br /><br />

      {previewUrl && (
        <div>
          <h3>Image Preview:</h3>
          <img src={previewUrl} alt="Preview" width="400px" />
        </div>
      )}

      <h3>Select Design Changes:</h3>
      <label>
        <input
          type="checkbox"
          name="wallColor"
          checked={design.wallColor}
          onChange={handleCheckboxChange}
        /> Change Wall Color
      </label><br />

      <label>
        <input
          type="checkbox"
          name="sofa"
          checked={design.sofa}
          onChange={handleCheckboxChange}
        /> Replace Sofa
      </label><br />

      <label>
        <input
          type="checkbox"
          name="lights"
          checked={design.lights}
          onChange={handleCheckboxChange}
        /> Add Ceiling Lights
      </label><br /><br />

      <button onClick={showSelected}>Show Selected Options</button>
    </div>
  );
}

export default App;
