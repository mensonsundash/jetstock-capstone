import { createContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";
import { getProfile, loginUser, registerUser } from "../api/authApi";
import { useToast } from "../hooks/useToast";

export const AuthContext = createContext(); // creating context

export const AuthProvider = ({children}) => {
    
    // Initialize user, token from current browser session
    const [user, setUser] = useState(storage.getUser());
    const [token, setToken] = useState(storage.getToken());
    const [loading, setLoading] = useState(true);

      // Global toast helpers
      const { showSuccess, showError } = useToast();

    // login function : send user detail to backend, save token & user in session, update react state
    const login = async (email, password) => {
        //sending user detail to authapi auth/login and get response {token ,data}
        const response = await loginUser({ email, password });

        const receiveToken = response.token;
        const loggedInUser = response.data;

        // storing in session
        storage.setToken(receiveToken);
        storage.setUser(loggedInUser);
        
        //changing state value
        setToken(receiveToken);
        setUser(loggedInUser);

        showSuccess("Login successfully");
        return response;
    }

    // register function: to record new user and senda data to auth/register
    const register = async (payload) => {
        const response = await registerUser(payload);
        return response;
    }
    
    // logout function: to clear session data & reset auth state
    const logout = () => {
        storage.clearAuth();
        setToken(null);
        setUser(null);
        showSuccess("Logout successfully");
    }

    // persistent data
    // restoreSession function: on app refresh if token exists in sesssionStorage, 
    // fetch latest profile from backend and restore auth state
    const restoreSession = async () => {
        try {
            const storedToken = storage.getToken();

            if(!storedToken) {
                setLoading(false);
                return;
            }
            const response = await getProfile();
            const profile = response.data;

            setUser(profile);
            setToken(storedToken);
            storage.setUser(profile);
        }catch(error) {
            console.log(error);
            // If token is invalid / expired, clear session
            storage.clearAuth();
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    }

    //Run this effect:
    // only once instance when app starts
    useEffect(() => {
        restoreSession();
    }, [])

    return(
        <AuthContext.Provider value={{ 
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!token
        }}>
            
            {children}
        </AuthContext.Provider>
    );
};