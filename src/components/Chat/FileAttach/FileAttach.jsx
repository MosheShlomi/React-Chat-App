import React, { useRef } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";

const FileAttach = ({ handleFile }) => {
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
    const moreOpen = Boolean(moreAnchorEl);

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const onFileChange = event => {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const handleClick = event => {
        setMoreAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setMoreAnchorEl(null);
    };

    return (
        <>
            <img src={`${publicUrl}/attach-file.svg`} alt="" onClick={handleClick} />

            <Menu
                id="basic-menu"
                anchorEl={moreAnchorEl}
                open={moreOpen}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleFileClick}>
                    <ListItemIcon>
                        <InsertDriveFileIcon fontSize="small" />
                    </ListItemIcon>
                    Upload File
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleImageClick}>
                    <ListItemIcon>
                        <ImageIcon fontSize="small" />
                    </ListItemIcon>
                    Upload Image
                </MenuItem>
            </Menu>

            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={onFileChange} />
            {/* Hidden image input */}
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={onFileChange}
            />
        </>
    );
};

export default FileAttach;
