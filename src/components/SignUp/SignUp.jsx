import React, { useState } from "react";
import "./signup.scss";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";

const SignUp = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleRegister = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = avatar.file ? await upload(avatar.file) : null;

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                blocked: [],
                ...(avatar.file && { avatar: imgUrl }),
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("You registered successfully! Now login.");
        } catch (err) {
            console.log("Registration error:", err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url != "" || import.meta.env.VITE_PUBLIC_URL + "/avatar.png"} alt="" />
                        Upload an image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <TextField
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                    />
                    <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
                    <TextField
                        label="Password"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                    />
                    <div className="text">
                        Already have an account?&ensp;
                        <Link to="/login">Login now</Link>
                    </div>
                    <button disabled={loading}>{loading ? "Loading" : "Sign up"}</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
