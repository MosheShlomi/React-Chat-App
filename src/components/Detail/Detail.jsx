import React, { useEffect, useState } from "react";
import "./detail.scss";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();
    const [sharedPhotos, setSharedPhotos] = useState([]);
    const [sharedFiles, setSharedFiles] = useState([]);
    const [expanded, setExpanded] = useState(false); // State to track which accordion is expanded
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const handleAccordionChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const fetchSharedData = async () => {
        try {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            if (chatDoc.exists()) {
                const data = chatDoc.data();
                console.log(data);

                const sharedPhotos = data.messages.filter(message => message.img).map(message => message.img);

                setSharedPhotos(sharedPhotos);
                setSharedFiles(data.sharedFiles || []);
            } else {
                setSharedPhotos([]);
                setSharedFiles([]);
            }
        } catch (error) {
            console.error("Error fetching shared data: ", error);
            toast.error("Error fetching shared data.");
        }
    };

    useEffect(() => {
        if (chatId && expanded === "panel2") {
            // Check if the correct accordion is expanded
            fetchSharedData();
        }
    }, [chatId, expanded]);

    const handleBlock = async () => {
        if (!user) {
            return;
        }

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            if (isReceiverBlocked) {
                await updateDoc(userDocRef, {
                    blocked: arrayRemove(user.id),
                });
                toast.success(`${user.username} Unblocked!`);
            } else {
                await updateDoc(userDocRef, {
                    blocked: arrayUnion(user.id),
                });
                toast.success(`${user.username} Blocked!`);
            }

            changeBlock();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="detail">
            <div className="user">
                <img
                    src={
                        user.avatar && !isCurrentUserBlocked && !isReceiverBlocked
                            ? user.avatar
                            : `${publicUrl}/avatar.png`
                    }
                    alt=""
                />
                <h2>{user?.username}</h2>
                <p>{user?.status || "Here should be status phrase of the user!"}</p>
            </div>
            <div className="info">
                <Accordion expanded={expanded === "panel1"} onChange={handleAccordionChange("panel1")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Chat Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Chat settings content goes here...</Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === "panel2"} onChange={handleAccordionChange("panel2")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Shared Photos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="photos">
                            {sharedPhotos.map((url, index) => (
                                <div className="photoItem" key={index}>
                                    <div className="photoDetail">
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            <img src={url} alt={`Shared photo ${index}`} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === "panel3"} onChange={handleAccordionChange("panel3")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Shared Files</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="files">
                            {sharedFiles.map((file, index) => (
                                <div className="fileItem" key={index}>
                                    <Typography>{file.name}</Typography>
                                    <Button variant="outlined" href={file.url} download>
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Privacy & Help</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="privacy-help-content">
                            <ul>
                                <li>
                                    <Typography variant="h6">GitHub project</Typography>
                                    <Typography paragraph>
                                        Your opinion is important to me. So if you liked this project - please give me a
                                        star on{" "}
                                        <a
                                            href="https://github.com/MosheShlomi/React-Chat-App"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Github
                                        </a>{" "}
                                        and fork the project.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="h6">Send Me an Email</Typography>
                                    <Typography paragraph>
                                        If you have any ideas, share them with{" "}
                                        <a
                                            href="mailto:folmoshe@gmail.com?subject=Support Request"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            me!
                                        </a>
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant="h6">Resources</Typography>
                                    <Typography paragraph>
                                        For other projects of Bonibon, visit my{" "}
                                        <a
                                            href="https://github.com/MosheShlomi"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Github
                                        </a>
                                        !
                                    </Typography>
                                </li>
                            </ul>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Button onClick={handleBlock} variant="contained" color={isReceiverBlocked ? "secondary" : "primary"}>
                    {isCurrentUserBlocked
                        ? "You are blocked!"
                        : isReceiverBlocked
                          ? "You blocked this user! Click again to unblock."
                          : "Block user!"}
                </Button>
            </div>
        </div>
    );
};

export default Detail;
