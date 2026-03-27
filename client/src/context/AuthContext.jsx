import { createContext, useState } from "react";

export const AuthContext = createContext(); // creating context

export const AuthProvider = ({children}) => {
    //temporary fake loggedin user
    const loggedInUser = {
        id: 1,
        name: "JetStock Admin",
        role: "admin"
    };
    // store logged in user
    const [user, setUser] = useState(loggedInUser);
    
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