import { useEffect } from "react";
import Chat from "./components/Chat/Chat";
import Detail from "./components/Detail/Detail";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import Notification from "./components/Notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId } = useChatStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, user => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
                <Route path="/sign-up" element={currentUser ? <Navigate to="/" /> : <SignUp />} />
                <Route path="*" element={<Navigate to="/login" />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <>
                                <List />
                                {chatId && <Chat />}
                                {chatId && <Detail />}
                            </>
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Notification />
        </Router>
    );
};

export default App;
