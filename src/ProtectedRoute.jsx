import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "./lib/userStore";

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useUserStore();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
