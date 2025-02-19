import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/newpasswordpage.css';

const NewPasswordPage = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleNewPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/reset/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            if (response.ok) {
                setMessage('Password reset successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setMessage('Error: Invalid or expired token.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An unexpected error occurred.');
        }
    };

    // return (
    //     <div className="new-password-page">
    //         <h2>Enter New Password</h2>
    //         <form onSubmit={handleNewPassword}>
    //             <input
    //                 type="text"
    //                 placeholder="Reset Token"
    //                 value={token}
    //                 onChange={(e) => setToken(e.target.value)}
    //             />
    //             <input
    //                 type="password"
    //                 placeholder="New Password"
    //                 value={newPassword}
    //                 onChange={(e) => setNewPassword(e.target.value)}
    //             />
    //             <input
    //                 type="password"
    //                 placeholder="Confirm New Password"
    //                 value={confirmPassword}
    //                 onChange={(e) => setConfirmPassword(e.target.value)}
    //             />
    //             <button type="submit" className="reset-button">Reset Password</button>
    //         </form>
    //         {message && <p className="message">{message}</p>}
    //     </div>
    // );
    return (
        <div className="new-password-page">
            <div className="new-password-container">
                <h2>Enter New Password</h2>
                <form onSubmit={handleNewPassword}>
                    <input
                        type="text"
                        placeholder="Reset Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="reset-button">Reset Password</button>
                </form>
                {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default NewPasswordPage;
