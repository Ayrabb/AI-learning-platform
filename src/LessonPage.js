import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LessonPage.css";

function LessonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson } = location.state || {};

  const imageUrls = (lesson && lesson.image_urls) || [];
  const videoUrls = (lesson && lesson.video_urls) || [];
  const [imageIndex, setImageIndex] = useState(0);

  if (!lesson) {
    return (
      <div className="lesson-page">
        <p>No lesson data available. Please go back and try again.</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const playAudio = () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson.lesson_text);
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="lesson-page">
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>{lesson.topic}</h2>

      <div className="lesson-text">
        <h3>Lesson Text:</h3>
        <p>{lesson.lesson_text || "No content available for this topic."}</p>

        <div className="audio-controls">
          <button onClick={playAudio}>🔊 Play Audio</button>
          <button onClick={stopAudio}>⏹️ Stop</button>
        </div>
      </div>

      {/* Image Slideshow */}
      <div className="media-section image-slideshow-card">
        <h3>Related Images:</h3>
        {imageUrls.length === 0 ? (
          <p>No images found for this topic.</p>
        ) : (
          <div className="slideshow-container">
            <img
              src={imageUrls[imageIndex]}
              alt={`Related to ${lesson.topic} ${imageIndex + 1}`}
              className="slideshow-image"
            />
            <p className="slideshow-caption">
              Image {imageIndex + 1} of {imageUrls.length}
            </p>
            <div className="slideshow-controls">
              <button
                onClick={() =>
                  setImageIndex((prev) =>
                    prev === 0 ? imageUrls.length - 1 : prev - 1
                  )
                }
              >
                ◀️ Previous
              </button>
              <button
                onClick={() =>
                  setImageIndex((prev) =>
                    prev === imageUrls.length - 1 ? 0 : prev + 1
                  )
                }
              >
                Next ▶️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Videos */}
      <div className="media-section">
        <h3>Related Videos:</h3>
        {videoUrls.length === 0 ? (
          <p>No videos found for this topic.</p>
        ) : (
          videoUrls.map((url, index) => (
            <iframe
              key={index}
              width="100%"
              height="315"
              src={url.replace("watch?v=", "embed/")}
              title={`Video related to ${lesson.topic} ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-frame"
            ></iframe>
          ))
        )}
      </div>
    </div>
  );
}

export default LessonPage;
