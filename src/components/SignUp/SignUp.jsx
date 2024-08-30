import React, { useState } from "react";
import "./signup.scss";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false);

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

        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

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
                        <img src={avatar.url != "" || import.meta.env.VITE_PUBLIC_URL + "./avatar.png"} alt="" />
                        Upload an image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />

                    <input type="password" placeholder="Password" name="password" />
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
