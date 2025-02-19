import '../styles/appbar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes, {string} from 'prop-types';
import profileIcon from '/img/profileicon.png';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext';
import Sidebar from './Sidebar'; // Import the Sidebar component

const AppBar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false); // Doar pentru Cart
    const [authMessage, setAuthMessage] = useState('');
    const user_id = localStorage.getItem("id") || null;
    const user_role = localStorage.getItem("role");
    const profileImage = localStorage.getItem('profileImage');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [oldCategory, setOldCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        if (category === oldCategory) {
            setSelectedCategory(null);
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            setIsSidebarOpen(true);
        }
        setOldCategory(category);
    };

    const handleCheckout = () => {
        if (user_id) {
            navigate('/checkout');
            setShowCartDropdown(false);
        } else {
            setAuthMessage('You must be authenticated before placing an order!');
        }
    };

    return (
        <>
            <header className="app-bar">
                <div className="category-selector">
                    <span
                        onClick={() => handleCategoryClick('MALE')}
                        className={selectedCategory === 'MALE' ? 'selected' : ''}
                    >
                        Male
                    </span>
                    <span
                        onClick={() => handleCategoryClick('FEMALE')}
                        className={selectedCategory === 'FEMALE' ? 'selected' : ''}
                    >
                        Female
                    </span>
                    <span
                        onClick={() => handleCategoryClick('UNISEX')}
                        className={selectedCategory === 'UNISEX' ? 'selected' : ''}
                    >
                        Unisex
                    </span>
                </div>
                <div className="app-name" onClick={() => navigate('/')}>
                    Fashion-World
                </div>
                <div className="action-container">
                    <div className="cart-container">
                        <button className="cart-button" onClick={() => setShowCartDropdown(!showCartDropdown)}>
                            🛒 Cart ({cartItems.length})
                        </button>
                        {showCartDropdown && (
                            <div className="cart-dropdown">
                                {cartItems.length > 0 ? (
                                    <ul>
                                        {cartItems.map(item => (
                                            <li key={item.id}>
                                                {item.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Cart is empty</p>
                                )}
                                {authMessage && <p className="auth-message">{authMessage}</p>}
                                <button className="checkout-button" onClick={handleCheckout}>
                                    Go to Checkout
                                </button>
                            </div>
                        )}
                    </div>

                    {user ? (
                        <button className="favorites-button" onClick={() => navigate('/favorites')}>
                        ❤️ Favorites
                    </button>
                    ):(
                        <p></p>
                    )}

                    {user ? (
                        <div className="user-info">
                            <span
                                onMouseEnter={() => setShowOptions(true)}
                                onMouseLeave={() => setShowOptions(false)}
                                className="user-icon">
                                <img
                                    src={profileImage || profileIcon}
                                    alt="User Icon"
                                    className="user-icon-img"
                                />
                                {user.username}
                            </span>
                            {showOptions && (
                                <div onMouseEnter={() => setShowOptions(true)}
                                     onMouseLeave={() => setShowOptions(false)}
                                     className="user-options">
                                    {user_role === "ADMIN" && (
                                        <button onClick={() => navigate('/admin/products')}>
                                            ADMIN Dashboard
                                        </button>
                                    )}
                                    <button onClick={() => navigate('/userorders')}>View Orders</button>
                                    <button onClick={() => navigate('/profile')}>View Profile</button>
                                    <button onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}>Sign Out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-button" onClick={() => navigate('/login')}>Login / Register</button>
                    )}
                </div>
            </header>

            {isSidebarOpen && <Sidebar gender={selectedCategory}/>}
        </>
    );
};


AppBar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    userName: PropTypes.string.isRequired,
    onSignOut: PropTypes.func.isRequired,
};

export default AppBar;
