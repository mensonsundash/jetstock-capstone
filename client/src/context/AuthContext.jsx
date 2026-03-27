import { createContext, useState } from "react";

export const AuthContext = createContext(); // creating context
export const AuthProvider = ({children}) => {
    // store user
    const [user, setUser] = useState(null)
    return(
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!true}}>
            {children}
        </AuthContext.Provider>
    );
};