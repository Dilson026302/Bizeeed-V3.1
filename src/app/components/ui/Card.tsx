import React from "react";
import "../../../assets/styles/HomePage.css";

interface CardProps {
  title: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ title, text }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
      
    </div>
  );
};

export default Card;
