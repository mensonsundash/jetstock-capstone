import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// reusable hooks for auth state
export const useAuth = () => useContext(AuthContext);