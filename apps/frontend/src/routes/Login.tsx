import React, { useState, useEffect } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();


        console.log('Logging in with:', username, password);

        // Save credentials if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); // Saving without encryption for simplicity
        } else {
            // Remove credentials if "Remember Me" is unchecked
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }

        // Proceed with actual login logic (e.g., API call to authenticate)
        alert('Login successful!');
    };

    return (
        <div id="login">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
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
