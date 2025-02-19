import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AppBar from './components/AppBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AdminProductsPage from './admin/AdminProductsPage';
import SingleProductPage from './pages/SingleProductPage';
import NewPasswordPage from './pages/NewPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import Cart from './components/Cart';
import { CartProvider } from './contexts/CartContext';
import { useState } from 'react';
import UserOrders from './pages/UserOrders';
import FavoritesPage from './pages/FavoritesPage';

const App = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');

    const handleLogin = (name) => {
        setIsAuthenticated(true);
        setUserName(name);
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
        setUserName('');
    };

    const showAppBar = location.pathname === '/' || location.pathname === '/products' || location.pathname.startsWith('/product/');

    return (
        <CartProvider>
            <div>
                {showAppBar && (
                    <AppBar
                        isAuthenticated={isAuthenticated}
                        userName={userName}
                        onSignOut={handleSignOut}
                    />
                )}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/products" element={<AdminProductsPage />} />
                    <Route path="/product/:id" element={<SingleProductPage />} />
                    <Route path="/new-password" element={<NewPasswordPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/userorders" element={<UserOrders />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
            </div>
        </CartProvider>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
