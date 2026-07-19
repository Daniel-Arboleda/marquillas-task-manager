import { Navigate } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
    const { initializing, isAuthenticated } = useAuth();

    if (initializing) {
        return <LoadingState message="Validating session..." />;
    }

    return isAuthenticated ? children : <Navigate replace to="/" />;
}