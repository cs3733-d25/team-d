import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/brigham_logo.png';
import logo from "../styles/brigham_logo.png";

function EmailInputPage() {
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if the email ends with @mgb.org
        if (email.endsWith('@mgb.org')) {
            // Store the user type as "employee" and email in localStorage
            localStorage.setItem('userType', 'employee');
            localStorage.setItem('email', email);
            // Redirect to the login page for employees
            navigate('/login');
        } else {
            // Store the user type as "patient" and email in localStorage
            localStorage.setItem('userType', 'patient');
            localStorage.setItem('email', email);
            // Redirect to the login page for patients
            navigate('/login');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                {/* Logo at the top */}
                <div className="logo-container">
                    <img src={logo} alt="Brigham and Women's Hospital Logo" className="logo" />
                </div>

                {/* Email input */}
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Next button */}
                <button type="submit">Next</button>
            </form>
        </div>
    );
}

export default EmailInputPage;