import { useEffect, useState } from "react";
import Chat from "./components/Chat/Chat";
import Detail from "./components/Detail/Detail";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import Notification from "./components/Notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import CircularProgress from "@mui/material/CircularProgress";
import Profile from "./components/Profile/Profile";
import useScreenSize from "./hooks/useScreenSize";
import useScreenStore from "./lib/screenStore";

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId } = useChatStore();
    const [showDetails, setShowDetails] = useState(false);
    const { isMobile, activeSection, setActiveSection } = useScreenStore();

    const basename = import.meta.env.MODE === "production" ? "/React-Chat-App" : "/";

    useScreenSize();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    if (isLoading) {
        return (
            <div className="loading">
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e01cd5" />
                            <stop offset="100%" stopColor="#1CB5E0" />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress sx={{ "svg circle": { stroke: "url(#my_gradient)" } }} />
                <span>Loading...</span>
            </div>
        );
    }

    const openDetailsSection = () => {
        if (showDetails) {
            setShowDetails(false);
            setActiveSection("chat");
        } else {
            setShowDetails(true);
            setActiveSection("detail");
        }
    };

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
                <Route path="/sign-up" element={currentUser ? <Navigate to="/" /> : <SignUp />} />
                <Route path="*" element={<Navigate to="/login" />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                {isMobile ? (
                                    <div className="mobile-navigation">
                                        {activeSection === "list" && <List />}
                                        {activeSection === "chat" && chatId && (
                                            <Chat handleOpenDetails={openDetailsSection} />
                                        )}
                                        {activeSection === "detail" && chatId && showDetails && <Detail />}
                                    </div>
                                ) : (
                                    <>
                                        <List />
                                        {chatId && <Chat handleOpenDetails={openDetailsSection} />}
                                        {chatId && showDetails && <Detail />}
                                    </>
                                )}
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Notification />
        </BrowserRouter>
    );
};

export default App;
