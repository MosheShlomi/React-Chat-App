import React from "react";
import "./userInfo.scss";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
    const { currentUser, fetchUserInfo } = useUserStore();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
    const moreOpen = Boolean(moreAnchorEl);
    const navigate = useNavigate();

    const handleClick = event => {
        setMoreAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMoreAnchorEl(null);
    };

    const logout = async () => {
        handleClose();
        auth.signOut();
        fetchUserInfo();
    };

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || `${publicUrl}/avatar.png`} alt="" onClick={handleClick} />
                <h4>{currentUser.username}</h4>
            </div>
            <div className="icons">
                <img src={`${publicUrl}/more.png`} alt="" onClick={handleClick} />
                <Menu
                    id="basic-menu"
                    anchorEl={moreAnchorEl}
                    open={moreOpen}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            navigate("/profile");
                        }}
                    >
                        Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default UserInfo;
