import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

// Protect Private routes: if auth still loading, show loader
// if no token/session exist , redirect to login
const ProtectedRoute = ({children}) => {

    const { isAuthenticated, loading } = useAuth();

    if(loading) {
        return <Loader />
    } 

    //if not authenticated direct to login page
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    //returning redirection to authenticated page
    return children;
}

export default ProtectedRoute;