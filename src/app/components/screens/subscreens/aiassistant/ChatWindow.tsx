import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../utils/supabaseClient";
import Message from "./Message";
import AudioRecorder from "./AudioRecorder";
import AttachFile from "./AttachFile";
import DeleteModal from "./DeleteModal";
import "../../../../../assets/styles/substyles/ChatWindowStyles.css";

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

interface MessageType {
  id?: string;
  conversation_id: string;
  user_id: string;
  sender: "user" | "assistant";
  content: string;
  file_url?: string;
  created_at: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSendMessage = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.user?.id) {
      console.error("Error fetching user:", userError);
      return;
    }

    const newMessage: MessageType = {
      conversation_id: conversationId,
      user_id: user.user.id,
      sender: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const { error: dbError } = await supabase.from("chat_messages").insert(newMessage);

      if (dbError) {
        console.error("Error saving message to Supabase:", dbError);
        return;
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: input }],
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error from OpenAI API:", responseData);
        return;
      }

      const assistantMessage: MessageType = {
        conversation_id: conversationId,
        user_id: user.user.id,
        sender: "assistant",
        content: responseData.choices[0]?.message?.content || "No response from assistant.",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const { error: assistantDbError } = await supabase.from("chat_messages").insert(assistantMessage);

      if (assistantDbError) {
        console.error("Error saving assistant message to Supabase:", assistantDbError);
      }
    } catch (error) {
      console.error("Error sending message to OpenAI API:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const maxHeight = lineHeight * 6 + 16;

    if (textarea.scrollHeight <= maxHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    }

    setInput(e.target.value);
  };

  const handleFileUpload = async (fileUrl: string, fileName: string) => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user?.user?.id) {
        console.error("Error fetching user:", userError);
        return;
      }

      const newMessage: MessageType = {
        conversation_id: conversationId,
        user_id: user.user.id,
        sender: "user",
        content: `File uploaded: ${fileName}`,
        file_url: fileUrl,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      const { error } = await supabase.from("chat_messages").insert(newMessage);

      if (error) {
        console.error("Error uploading file message:", error);
      }
    } catch (error) {
      console.error("Error during file upload handling:", error);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", selectedMessage.id);

    if (error) {
      console.error("Error deleting message:", error);
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== selectedMessage.id));
      setIsModalOpen(false);
      setSelectedMessage(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <button onClick={onBack}>Back</button>
      <div className="chat-body">
        {messages.map((msg) => (
          <Message
            key={msg.id || msg.created_at}
            message={msg}
            onDelete={() => {
              setSelectedMessage(msg);
              setIsModalOpen(true);
            }}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <AttachFile onFileUpload={handleFileUpload} bucketName="chat-uploads" />
        <AudioRecorder onAudioUpload={handleFileUpload} />
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          rows={1}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteSuccess={handleDeleteMessage}
      />
    </div>
  );
};

export default ChatWindow;
