import React from "react";
import Card from "../../ui/Card"; // Adjust the import path if needed
import "../../../../assets/styles/Dashboard.css";

const DashboardHome: React.FC = () => {
  const cards = [
    { title: "Analytics", text: "View your analytics data and reports." },
    { title: "Tasks", text: "Manage and track your daily tasks." },
    { title: "Messages", text: "Check your latest messages and notifications." },
    { title: "Settings", text: "Configure your account and app preferences." },
    { title: "Calendar", text: "View and manage your events and appointments." },
    { title: "Notifications", text: "Get updates about system changes and events." },
    { title: "Profile", text: "Edit and customize your personal profile." },
    { title: "Documents", text: "Upload and manage your files and documents." },
    { title: "Support", text: "Get help and support from our team." },
    { title: "Billing", text: "Manage your billing and payment information." },
    { title: "Projects", text: "Organize and track your ongoing projects." },
    { title: "Contacts", text: "Store and manage your professional contacts." },
  ];

  return (
    <div className="card-section">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} text={card.text} />
      ))}
    </div>
  );
};

export default DashboardHome;
