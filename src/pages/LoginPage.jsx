import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import '../styles/loginpage.css';
import { useAuth } from '../contexts/AuthContext.jsx';

const LoginPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            console.log(response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data.message);
                // login({ email, username: data.username });
                login({ email, username: data.username, role: data.role });
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                localStorage.setItem('role', data.role);
                localStorage.setItem('id',data.id);

                const userName = data.username; // Get username from the response
                onLogin(userName);

                navigate('/');
            } else {
                const errorMessage = await response.json();
                setError(errorMessage.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };





    return (
        <div className="login-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
            <button className="home-button" onClick={() => navigate('/')}>
                Home
            </button>
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="login-links">
                    <p onClick={() => navigate('/reset-password')}>Forgot Password?</p>
                    <p onClick={() => navigate('/register')}>NO account? Create one!</p>
                </div>
            </div>
        </div>
    );
};

LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired, // Add prop types for validation
};

export default LoginPage;
