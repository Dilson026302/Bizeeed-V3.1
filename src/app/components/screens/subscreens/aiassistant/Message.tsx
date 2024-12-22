import React from "react";
import "../../../../../assets/styles/substyles/ChatWindowStyles.css";
import { FaTrash } from "react-icons/fa";

interface MessageProps {
  message: {
    id?: string;
    content: string;
    file_url?: string;
    sender: "user" | "assistant";
  };
  onDelete: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onDelete }) => {
  const isImage = (url: string): boolean => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);

  console.log("File URL:", message.file_url); // Debugging: Check file_url value

  return (
    <div className={`message ${message.sender === "user" ? "user" : "assistant"}`}>
      <p>{message.content}</p>

      {/* Render Image */}
      {message.file_url && isImage(message.file_url) && (
        <img
          src={message.file_url}
          alt="Uploaded file"
          className="responsive-image"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) =>
            console.error("Image failed to load:", e.currentTarget.src)
          } // Debug load error
        />
      )}

      {/* Render File Link */}
      {message.file_url && !isImage(message.file_url) && (
        <a
          href={message.file_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#007BFF" }}
        >
          View File
        </a>
      )}

      <FaTrash size={15} className="delete-icon" onClick={onDelete} />
    </div>
  );
};

export default Message;
