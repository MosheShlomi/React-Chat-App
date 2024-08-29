import React from "react";
import "./userInfo.scss";
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
    const { currentUser } = useUserStore();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || `${publicUrl}/avatar.png`} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src={`${publicUrl}/more.png`} alt="" />
                <img src={`${publicUrl}/video.png`} alt="" />
                <img src={`${publicUrl}/edit.png`} alt="" />
            </div>
        </div>
    );
};

export default UserInfo;
