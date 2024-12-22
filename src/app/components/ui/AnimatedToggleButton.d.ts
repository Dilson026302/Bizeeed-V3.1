declare module "../ui/AnimatedToggleButton" {
  import React from "react";

  interface AnimatedToggleButtonProps {
    isOpen: boolean;
    onClick: () => void;
  }

  const AnimatedToggleButton: React.FC<AnimatedToggleButtonProps>;
  export default AnimatedToggleButton;
}
