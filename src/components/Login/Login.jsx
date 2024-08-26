import React, { useState } from "react";
import "./login.scss";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Link } from "react-router-dom";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);
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
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <div className="text">
                        Not a member?&ensp;<Link to="/sign-up">Sign Up now</Link>
                    </div>
                    <button disabled={loading}>{loading ? "Loading" : "Sign in"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
