import React, { useState } from "react";
import ChatHome from "./ChatHome";
import ChatWindow from "./ChatWindow";
import "../../../../../assets/styles/substyles/MainChatStyles.css";
import AnimatedToggleButton from "../../../ui/AnimatedToggleButton";

const ChatApp: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="chat-app">
      <div className={`sidebarchat ${isSidebarOpen ? "open" : "closed"}`}>
        <AnimatedToggleButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
        {isSidebarOpen && <ChatHome onSelectConversation={handleSelectConversation} />}
      </div>
      <div className="main-content">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="placeholder">
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
