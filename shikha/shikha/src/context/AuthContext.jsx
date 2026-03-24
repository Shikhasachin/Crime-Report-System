import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name: string, role: 'citizen' | 'police' | 'admin' }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('crs_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // userData: { name, email, role, token }
        setUser(userData);
        localStorage.setItem('crs_user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('crs_token', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('crs_user');
        localStorage.removeItem('crs_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
