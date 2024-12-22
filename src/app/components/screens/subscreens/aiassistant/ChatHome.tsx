import React, { useState, useEffect } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import "../../../../../assets/styles/substyles/ChatWindowStyles.css";

interface ChatHomeProps {
  onSelectConversation: (conversationId: string) => void;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const ChatHome: React.FC<ChatHomeProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data || []);
    }
  };

  const handleNewConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title: `Conversation ${Date.now()}`, created_at: new Date().toISOString() })
      .select();

    if (error) {
      console.error("Error creating conversation:", error);
    } else {
      fetchConversations();
      if (data && data[0]) onSelectConversation(data[0].id);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    const { error } = await supabase.from("conversations").delete().eq("id", id);

    if (error) {
      console.error("Error deleting conversation:", error);
    } else {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="chat-home">
      <button className="new-button" onClick={handleNewConversation}>
        + New Conversation
      </button>
      <div className="conversation-list">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="conversation-item"
            onClick={() => onSelectConversation(conv.id)}
          >
            <span>{conv.title}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConversation(conv.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHome;
