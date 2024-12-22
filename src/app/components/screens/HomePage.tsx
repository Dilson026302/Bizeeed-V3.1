import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "../../../assets/styles/HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Achieve More with Ease</h1>
          <p className="hero-subtitle">
            Empower your marketing strategy with cutting-edge automation and AI insights.
          </p>
          <Button
            className="cta-button-primary" // Example custom class
            text="Get Started"
            onClick={handleGetStarted}
          />
        </div>
        <div className="hero-image">
          {/* Placeholder content for the hero image section */}
          <div className="image-placeholder"></div>
        </div>
      </div>

      <section className="features-showcase">
        <h2 className="features-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-placeholder"></div>
            <h3 className="feature-title">Centralized Management</h3>
            <p className="feature-description">
              Manage all your social media platforms from a single intuitive dashboard.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-placeholder"></div>
            <h3 className="feature-title">AI Insights</h3>
            <p className="feature-description">
              Make data-driven decisions with real-time analytics powered by AI.
            </p>
          </div>
          <div className="feature-card">
            <div className="icon-placeholder"></div>
            <h3 className="feature-title">Seamless Automation</h3>
            <p className="feature-description">
              Automate repetitive tasks to focus on what truly matters for your business.
            </p>
          </div>
        </div>
      </section>

      <footer className="homepage-footer">
        <p className="footer-text">Start your journey to effortless marketing today.</p>
        <Button
          className="cta-button-secondary" // Example custom class
          text="Get Started"
          onClick={handleGetStarted}
        />
      </footer>
    </div>
  );
};

export default HomePage;
