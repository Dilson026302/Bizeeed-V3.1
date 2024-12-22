import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate, Outlet } from "react-router-dom";
import "../../../assets/styles/Dashboard.css";
import Sidebar from "../ui/Sidebar";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className={`dashboard-content ${isCollapsed ? "collapsed" : "expanded"}`}>
        {/* Always render the Outlet for child routes */}
        <Outlet context={{ isCollapsed }} />
      </div>
    </div>
  );
};

export default Dashboard;
