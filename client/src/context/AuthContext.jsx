import { createContext, useState } from "react";

export const AuthContext = createContext(); // creating context
export const AuthProvider = ({children}) => {
    // store logged in user
    const [user, setUser] = useState(null);
    
    return(
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user}}>
            {children}
        </AuthContext.Provider>
    );
};