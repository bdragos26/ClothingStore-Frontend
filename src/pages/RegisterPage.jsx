import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/registerpage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    const validateUsername = (username) => {
        return username.trim() !== ''; // Check that the username is not empty
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
        return emailPattern.test(email); // Check if the email matches the pattern
    };

    const validatePassword = (password) => {
        return (
            password.length >= 10 && // Check for minimum length
            /[A-Z]/.test(password) && // Check for at least one uppercase letter
            /\d/.test(password) // Check for at least one digit
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            setMessage('Username is required.');
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            setMessage('Password must be at least 10 characters long, contain at least one uppercase letter, and one digit.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        // Here you would typically make a request to register the user
        const registerData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                // Înregistrare cu succes
                // const data = await response.json();
                setMessage('Registration successful! Redirecting to login...');
                setCountdown(4);
            } else {
                // Eroare în timpul înregistrării
                const errorMessage = await response.text();
                setMessage(errorMessage);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An unexpected error occurred. Please try again later.');
        }

    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            // Redirect after countdown
            if (countdown === 1) {
                navigate('/login'); // Redirect to login page
            }

            return () => clearInterval(timer);
        }
    }, [countdown, navigate]);

    return (
        <div className="register-page">
            <button className="home-button" onClick={() => navigate('/')}>
                Home
            </button>
            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
                {message && (
                    <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
                        {message}
                    </p>
                )}
                {countdown > 0 && (
                    <p className="countdown">Redirecting in {countdown} seconds...</p>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
