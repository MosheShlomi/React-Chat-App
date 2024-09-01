import React from "react";
import "./userInfo.scss";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

const UserInfo = () => {
    const { currentUser } = useUserStore();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
    const moreOpen = Boolean(moreAnchorEl);
    const handleClick = event => {
        setMoreAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMoreAnchorEl(null);
    };

    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || `${publicUrl}/avatar.png`} alt="" />
                <h2>{currentUser.username}</h2>
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
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            auth.signOut();
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default UserInfo;
