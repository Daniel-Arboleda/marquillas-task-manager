import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authApi from "../api/authApi";
import TokenStorage from "./TokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(TokenStorage.getToken());
    const [user, setUser] = useState(null);

    const clearSession = useCallback(() => {
        TokenStorage.removeToken();
        setToken(null);
        setUser(null);
    }, []);

    const loadCurrentUser = useCallback(async () => {
        if (!token) {
            return;
        }
        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch {
            clearSession();
        }
    }, [token, clearSession]);

    useEffect(() => {
        loadCurrentUser();
    }, [loadCurrentUser]);

    async function login(credentials) {
        const response = await authApi.login(credentials);
        TokenStorage.setToken(response.access_token);
        setToken(response.access_token);
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
        return currentUser;
    }

    function logout() {
        clearSession();
    }

    const value = useMemo(
        () => ({
            token,
            user,
            login,
            logout,
            isAuthenticated: Boolean(token),
        }),
        [token, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export default AuthContext;