import React from "react";
import "../../../assets/styles/HomePage.css";

interface ButtonProps {
  text: string;
  onClick?: () => void; // Optional onClick handler
  className?: string; // Add this to accept a className
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button className={`cta-button ${className || ""}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
