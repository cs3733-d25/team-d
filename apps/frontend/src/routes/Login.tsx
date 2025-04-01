import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    // UseEffect to check if credentials are saved in localStorage
    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true); // Pre-check "remember me" box if credentials are saved
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        console.log('Logging in with:', username, password);

        // Save credentials if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            // Remove credentials if "Remember Me" is unchecked
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }

        // Proceed with actual login logic (e.g., API call to authenticate)
        alert('Login successful!');
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label htmlFor="username">Username:</label>
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
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)} // Checkbox toggle method
                        />
                        Remember me
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
