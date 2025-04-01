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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        console.log('Logging in with:', username, password);

        // Save credentials if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password); // Saving without encryption or now
        } else {
            // Remove credentials if "Remember Me" is unchecked
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }


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
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f1f1f1', // Soft Gray
    },
    form: {
        backgroundColor: '#fff', // White
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#f9f9f9', // Light Soft Gray
    },
    checkboxContainer: {
        marginBottom: '20px',
    },
    checkboxLabel: {
        fontSize: '14px',
        color: '#333',
    },
    checkbox: {
        marginRight: '8px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff', // Blue
        color: '#fff', // White text
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3', // Darker Blue on hover
    },
};

export default Login;
