import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Avatar, Typography } from "@mui/material";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./profile.scss";
import { imageUpload } from "../../lib/upload";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const Profile = () => {
    const { currentUser } = useUserStore();
    const [username, setUsername] = useState(currentUser?.username || "");
    const [slogan, setSlogan] = useState(currentUser?.slogan || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [avatar, setAvatar] = useState(currentUser?.avatar || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    useEffect(() => {
        setUsername(currentUser?.username || "");
        setSlogan(currentUser?.slogan || "");
        setEmail(currentUser?.email || "");
        setAvatar(currentUser?.avatar || "");
    }, [currentUser]);

    const handleAvatarChange = e => {
        const file = e.target.files[0];
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async () => {
        const userDocRef = doc(db, "users", currentUser.id);

        try {
            let avatarUrl = currentUser.avatar;

            if (avatarFile) {
                avatarUrl = await imageUpload(avatarFile);
            }

            await updateDoc(userDocRef, {
                username,
                slogan,
                email,
                avatar: avatarUrl,
                blocked: currentUser.blocked,
            });

            toast.success("Profile updated successfully!");
            window.location.href = "/";
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error("Failed to update profile.");
        }
    };

    return (
        <div className="profile-container">
            <div className="back-home-btn">
                <Button variant="outlined" onClick={() => navigate("/")}>
                    <ArrowBackIosIcon />
                </Button>
            </div>
            <Typography variant="h6" className="profile-title">
                Edit Profile
            </Typography>
            <div className="profile-avatar">
                <Avatar src={avatar} alt="Avatar" sx={{ width: 100, height: 100 }} />
                <Button variant="outlined" component="label">
                    Change Avatar
                    <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                </Button>
            </div>
            <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Slogan"
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                fullWidth
                className="profile-save-button"
            >
                Save Changes
            </Button>
        </div>
    );
};

export default Profile;
