import React, { useState } from "react";
import LoginForm from "../forms/LoginForm";
import SignupForm from "../forms/SignupForm";
import "../../../assets/styles/AuthForms.css";

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-left">
        <div className="branding">
          <h1>Bizeeed</h1>
          <p>Streamline your social media marketing effortlessly.</p>
        </div>
      </div>
      <div className="auth-page-right">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${showLogin ? "active" : ""}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${!showLogin ? "active" : ""}`}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </button>
        </div>
        <div className="auth-form-container">
          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
