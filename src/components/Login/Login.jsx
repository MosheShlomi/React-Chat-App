import React, { useState } from "react";
import "./login.scss";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import { useUserStore } from "../../lib/userStore";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { fetchUserInfo } = useUserStore();

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            fetchUserInfo(auth.currentUser.uid);
            toast.success("You signed in successfully!");
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="item">
                <h2>Welcome back</h2>
                <form onSubmit={handleLogin}>
                    <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
                    <TextField
                        label="Password"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="on"
                        fullWidth
                    />
                    <div className="text">
                        Not a member?&ensp;<Link to="/sign-up">Sign Up</Link>
                    </div>
                    <button disabled={loading}>{loading ? "Loading" : "Sign in"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
