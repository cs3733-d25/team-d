import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import logo from '../styles/brigham_logo.png';

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [userType, setUserType] = useState<string>('');
    const navigate = useNavigate();

    // UseEffect to get the email and userType stored in localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedUserType = localStorage.getItem('userType');

        if (savedEmail) {
            setUsername(savedEmail);  // Pre-fill the email field with the saved email
        }

        if (savedUserType) {
            setUserType(savedUserType);  // Set the user type (employee or patient)
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Logging in with:', username, password);

        // Save credentials if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); // Saving without encryption for now
        } else {
            // Remove credentials if "Remember Me" is unchecked
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }

        // Check if the email ends with @mgb.org (although it's already checked earlier)
        if (username.endsWith('@mgb.org')) {
            // Redirect to ServiceRequest.tsx (for employees)
            navigate('/servicerequest');
        } else {
            // Redirect to Map.tsx (for patients)
            navigate('/map');
        }

        alert('Login successful!');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                {/* Logo at the top */}
                <div className="logo-container">
                    <img src={logo} alt="Brigham and Women's Hospital Logo" className="logo" />
                </div>

                {/* Display Patient or Employee Login based on the user type */}
                <div>
                    <h2>{userType === 'employee' ? 'Employee Login' : 'Patient Login'}</h2>
                </div>

                <div>
                    <label htmlFor="username">Email:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="checkbox-container">
                    <label>Remember Password</label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)} // Checkbox toggle method
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

