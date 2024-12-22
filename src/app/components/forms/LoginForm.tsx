import React, { useState } from 'react';
import "../../../assets/styles/AuthForms.css";
import { supabase } from "../../utils/supabaseClient"; // Ensure this path is correct

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Login successful!");
            localStorage.setItem("supabase_session", JSON.stringify(data.session));
            setTimeout(() => {
                window.location.href = "/dashboard"; // Redirect to dashboard
            }, 1000);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>Email</label>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password</label>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="auth-button">Login</button>
            {message && <p className="auth-message">{message}</p>}
        </form>
    );
};

export default LoginForm;
