import React, { useState } from 'react';
import "../../../assets/styles/AuthForms.css";
import { supabase } from "../../utils/supabaseClient"; // Ensure this path is correct

const SignupForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Signup successful! Please verify your email.");
            setTimeout(() => {
                window.location.href = "/auth"; // Redirect to login page
            }, 2000);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSignup}>
            <h2>Sign Up</h2>
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
            <button type="submit" className="auth-button">Sign Up</button>
            {message && <p className="auth-message">{message}</p>}
        </form>
    );
};

export default SignupForm;
