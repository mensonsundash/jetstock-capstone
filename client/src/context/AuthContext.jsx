import { createContext, useState } from "react";

export const AuthContext = createContext(); // creating context
export const AuthProvider = ({children}) => {
    // store logged in user
    const [user, setUser] = useState(null);
    
    // reset user details to null when logout
    const logout = () => {
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{ 
            user, 
            setUser,
            logout,
            isAuthenticated: !!user
        }}>
            
            {children}
        </AuthContext.Provider>
    );
};