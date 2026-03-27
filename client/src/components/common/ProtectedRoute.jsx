import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

// block access to private pages and redirect to login for non authenticated user
const ProtectedRoute = ({children}) => {

    const { isAuthenticated } = useAuth();

    //if not authenticated direct to login page
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    //returning redirection to authenticated page
    return children;
}

export default ProtectedRoute;