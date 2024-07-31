import React, { useState } from "react";
import "./App.css"; // Ensure you have a CSS file to handle showing/hiding

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.image_url) {
        setImageUrl(data.image_url);
        setShowImage(true);
        setCaption(data.caption || ""); // Set caption if available
        setShowCaption(false); // Hide caption initially
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert(`An error occurred while uploading the file: ${error.message}`);
    }
  };

  const handleGenerateCaption = () => {
    setShowCaption(true); // Show caption
  };

  return (
    <div className="App">
      <h1>Image Captioning</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <div className={`image-container ${showImage ? "show" : "hide"}`}>
        <h3>Image:</h3>
        <img src={`http://127.0.0.1:5000${imageUrl}`} alt="Uploaded" />
        <br />
        <button onClick={handleGenerateCaption}>Generate Caption</button>
      </div>
      <div className={`caption-container ${showCaption ? "show" : "hide"}`}>
        <h3>Caption:</h3>
        <p>{caption}</p>
      </div>
    </div>
  );
};

export default App;
