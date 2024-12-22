import React from "react";
import "../../../assets/styles/toggle-switch.css";

interface ToggleSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isDarkMode, onToggle }) => {
  return (
    <div className="toggle-container" onClick={onToggle}>
      <div className={`toggle-switch ${isDarkMode ? "active" : ""}`} />
      <span className="toggle-label">
        {isDarkMode ? "Dark" : "Light"}
      </span>
    </div>
  );
};

export default ToggleSwitch;
