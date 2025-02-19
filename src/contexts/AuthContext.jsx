import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verifică localStorage pentru a păstra utilizatorul autentificat
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Salvează utilizatorul în localStorage
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Elimină utilizatorul din localStorage
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('cart');
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
