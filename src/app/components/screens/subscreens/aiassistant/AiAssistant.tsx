import React, { useState } from "react";
import ChatHome from "./ChatHome";
import ChatWindow from "./ChatWindow";
import ChatApp from "./ChatApp";
import "../../../../../assets/styles/substyles/AiAssistant.css";

const AiAssistant = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"assistant" | "image" | "video">("assistant");

  const handleSelectConversation = (id: string) => {
    console.log("Selected conversation ID:", id);
    setSelectedConversation(id);
  };

  const handleBackToHome = () => {
    setSelectedConversation(null); // Reset selected conversation
  };

  return (
    <div className="analytics-home-container">
      {/* Header Tabs */}
      <div className="analytics-header">
        <button
          className={`tab-button ${activeTab === "assistant" ? "active" : ""}`}
          onClick={() => setActiveTab("assistant")}
        >
          <span className="tab-text">AI Assistant</span>
        </button>
        <button
          className={`tab-button ${activeTab === "image" ? "active" : ""}`}
          onClick={() => setActiveTab("image")}
        >
          <span className="tab-text">AI Image Generation</span>
        </button>
        <button
          className={`tab-button ${activeTab === "video" ? "active" : ""}`}
          onClick={() => setActiveTab("video")}
        >
          <span className="tab-text">AI Video Generation</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="analytics-body">
        {activeTab === "assistant" && (
          <div className="card-ai-assistant">
          <ChatApp />
        </div>
        
        )}

        {activeTab === "image" && (
          <div className="card-ai-image-generation">
             <p>This feature is under work.</p>
          </div>
        )}

        {activeTab === "video" && (
          <div className="card-ai-video-generation">
            <p>This feature is under work.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
