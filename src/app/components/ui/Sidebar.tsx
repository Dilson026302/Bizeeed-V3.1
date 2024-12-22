import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../../assets/styles/Sidebar.css";
import { useFetch } from "../../../hooks/useFetch"; // Assuming this hook is configured
import ToggleSwitch from "./ToggleSwitch";

import homeIcon from "../../../assets/icons/home-icon.png";
import connectIcon from "../../../assets/icons/connect-icon.png";
import scheduleIcon from "../../../assets/icons/schedule-icon.png";
import analyticsIcon from "../../../assets/icons/analytics-icon.png";
import digitalMarketingIcon from "../../../assets/icons/digitalmarketing-icon.png";
import brainstormIcon from "../../../assets/icons/brainstorm-icon.png";
import heartIcon from "../../../assets/icons/heart-icon.png";
import competitorAnalysisIcon from "../../../assets/icons/competitoranalysis-icon.png";
import quillpenIcon from "../../../assets/icons/quillpen-icon.png";
import websiteIcon from "../../../assets/icons/website-icon.png";
import layersIcon from "../../../assets/icons/layers-icon.png";
import NotificationIcon from "../../../assets/icons/notification-icon.png";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { userDetails, logout } = useFetch();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      name: "Dashboard Home",
      path: "/dashboard",
      icon: <img src={homeIcon} alt="Dashboard" />,
      end: true,
    },
    {
      name: "Social Accounts Linking",
      path: "/dashboard/social-accounts",
      icon: <img src={connectIcon} alt="Social Accounts" />,
    },
    {
      name: "Publishing & Scheduling",
      path: "/dashboard/publishing",
      icon: <img src={scheduleIcon} alt="Publishing & Scheduling" />,
    },
    {
      name: "Analytics",
      path: "/dashboard/analytics-home",
      icon: <img src={analyticsIcon} alt="Analytics" />,
    },
    {
      name: "Digital Marketing",
      path: "/dashboard/digital-marketing",
      icon: <img src={digitalMarketingIcon} alt="Digital Marketing" />,
    },
    {
      name: "AI Assistant",
      path: "/dashboard/ai-assistant",
      icon: <img src={brainstormIcon} alt="AI Assistant" />,
    },
    {
      name: "Influencer Management",
      path: "/dashboard/influencer-managment",
      icon: <img src={heartIcon} alt="Influencer Management" />,
    },
    {
      name: "Competitor Analysis",
      path: "/dashboard/competitor-analysis",
      icon: <img src={competitorAnalysisIcon} alt="Competitor Analysis" />,
    },
    {
      name: "Product Development",
      path: "/dashboard/product-development",
      icon: <img src={quillpenIcon} alt="Product Development" />,
    },
    {
      name: "Website Management",
      path: "/dashboard/website-management",
      icon: <img src={websiteIcon} alt="Website Management" />,
    },
    {
      name: "Team & Tasks",
      path: "/dashboard/team-tasks",
      icon: <img src={layersIcon} alt="Team & Tasks" />,
    },
  ];

  return (
    <div
      className={`sidebar ${isCollapsed && !isHovered ? "collapsed" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            title={isCollapsed ? item.name : ""}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {(!isCollapsed || isHovered) && (
              <span className="sidebar-text">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Bottom Section */}
      <div className="sidebar-bottom">
        {/* Theme Toggle Switch */}
        <div className="sidebar-link">
          <ToggleSwitch isDarkMode={theme === "dark"} onToggle={toggleTheme} />
        </div>

        {/* Notification Section */}
        <div className="sidebar-notification">
          <img
            src={NotificationIcon}
            alt="Notifications"
            className="sidebar-icon"
          />
          {(!isCollapsed || isHovered) && (
            <span className="sidebar-text">Notifications</span>
          )}
        </div>

        {/* Avatar Section */}
        <div className="sidebar-avatar">
          <img
            src={userDetails?.profilePicture || "https://via.placeholder.com/40"}
            alt="User Avatar"
            className="avatar"
          />
          {(!isCollapsed || isHovered) && (
            <span className="sidebar-text">{userDetails.email}</span>
          )}
        </div>

        {/* My Account and Logout Buttons */}
        <div className="sidebar-myaccount">
          <NavLink to="/dashboard/my-account" className="sidebar-myaccount">
            <span>My Account</span>
          </NavLink>
          <div className="sidebar-logout" onClick={handleLogout}>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
