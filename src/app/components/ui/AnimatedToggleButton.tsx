import React from "react";
import "../../../assets/styles/AnimatedToggleButton.css";

interface AnimatedToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const AnimatedToggleButton: React.FC<AnimatedToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button className={`animated-toggle-btn ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="arrow-container">
        <div className="arrow"></div>
      </div>
    </button>
  );
};

export default AnimatedToggleButton;
