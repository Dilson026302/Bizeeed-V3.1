import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./app/components/screens/HomePage";
import AuthPage from "./app/components/screens/AuthPage";
import LoginForm from "./app/components/forms/LoginForm";
import SignupForm from "./app/components/forms/SignupForm";
import Dashboard from "./app/components/screens/Dashboard";
import MyAccount from "./app/components/screens/MyAccount";
import SocialLinks from "./app/components/screens/subscreens/socialmedialinking/SocialLinks";
import PublishingScheduling from "./app/components/screens/subscreens/publishingscheduling/PublishingScheduling";
import AiAssistant from "./app/components/screens/subscreens/aiassistant/AiAssistant";
import AnalyticsHome from "./app/components/screens/subscreens/AnalyticsHm/AnalyticsHome";
import DigitalMarketing from "./app/components/screens/subscreens/DigitalMarketing";
import InfluencerManagement from "./app/components/screens/subscreens/InfluencerManagement";
import WebsiteManagement from "./app/components/screens/subscreens/WebsiteManagement";
import TeamTask from "./app/components/screens/subscreens/TeamTask";
import CompetitorAnalysis from "./app/components/screens/subscreens/CompetitorAnalysis";
import ProductDevelopment from "./app/components/screens/subscreens/ProductDevelopment";


import DashboardHome from "./app/components/screens/subscreens/DashboardHome"; // Import DashboardHome


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/auth" element={<AuthPage />} />
        
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested Routes under Dashboard */}
          <Route index element={<DashboardHome />} /> {/* Default route for /dashboard */}
          <Route path="social-accounts" element={<SocialLinks />} />
          
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="analytics-home" element={<AnalyticsHome />} />
          <Route path="digital-marketing" element={<DigitalMarketing />} />
          <Route path="publishing" element={<PublishingScheduling />} />
          <Route path="influencer-managment" element={<InfluencerManagement />} />
          <Route path="website-management" element={<WebsiteManagement />} />
          <Route path="team-tasks" element={<TeamTask />} />
          <Route path="competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="product-development" element={<ProductDevelopment />} />
          <Route path="my-account" element={<MyAccount />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
