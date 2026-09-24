import React, { createContext, useState, useEffect } from 'react';

/* this auth context will be used for storing and managing the user data and token */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Retrieve user and token from localStorage if logged in previously
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser({
                    ...parsed,
                    name: parsed.name || parsed.username,
                    picture: parsed.picture || parsed.image,
                });
            } catch (e) {
                console.error("Error parsing user from localStorage:", e);
            }
        }
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (userData, authToken) => {
        const normalizedUser = {
            ...userData,
            name: userData.name || userData.username,
            picture: userData.picture || userData.image,
        };
        setUser(normalizedUser);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        if (authToken) {
            localStorage.setItem('token', authToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
