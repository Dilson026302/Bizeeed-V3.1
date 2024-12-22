import React, { useEffect, useState } from "react";

const CompetitorAnalysis: React.FC = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Function to toggle between light and dark mode
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Apply the theme on initial render
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Competitor Analytics</h1>
            <p>
                The user can add the list of competitors and their social media and
                website to gain insights on the growth of competitors and the new trends
                in the industry.
            </p>

            {/* Toggle Button for Dark Mode */}
            <button
                onClick={toggleTheme}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--primary-color)",
                    color: "var(--text-color)",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                }}
            >
                Toggle {theme === "light" ? "Dark" : "Light"} Mode
            </button>
        </div>
    );
};

export default CompetitorAnalysis;
