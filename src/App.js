import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import LessonPage from "./LessonPage";

function HomePage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateLesson = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate-lesson", {
        topic: topic,
      });
      navigate("/lesson", { state: { lesson: response.data } });
    } catch (error) {
      console.error("Error generating lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Learning Platform</h1>
        <p>Explore educational lessons for kids powered by Artificial Intelligence</p>
      </header>
      <main className="App-main">
        <div className="lesson-input">
          <label htmlFor="topic">Enter a Learning Topic:</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., The Solar System"
          />
          <button onClick={handleGenerateLesson} disabled={loading}>
            {loading ? "Generating..." : "Generate Lesson"}
          </button>
        </div>
      
      </main>
      <footer className="App-footer">
        <p>Created by Ibrahim Hamid</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;