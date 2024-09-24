import React, { useEffect, useState } from "react";
import "./detail.scss";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConfirmationDialog from "../Dialogs/ConfirmationDialog";

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } = useChatStore();
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

                const sharedPhotos = data.messages.filter(message => message.img).map(message => message.img);
                const sharedFiles = data.messages
                    .filter(message => message.file)
                    .map(message => {
                        return { name: message.fileName, url: message.file };
                    });

                setSharedPhotos(sharedPhotos);
                setSharedFiles(sharedFiles);
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
        if (chatId && (expanded === "panel2" || expanded === "panel3")) {
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

    const handleDeleteChat = async () => {
        if (!user || !currentUser) return;

        try {
            const userChatsRef = doc(db, "userchats", currentUser.id);
            const receiverChatsRef = doc(db, "userchats", user.id);
            const [userChatsSnap, receiverChatsSnap] = await Promise.all([
                getDoc(userChatsRef),
                getDoc(receiverChatsRef),
            ]);

            if (userChatsSnap.exists()) {
                const userChatsData = userChatsSnap.data();
                const chatToDelete = userChatsData.chats.find(chat => chat.receiverId === user.id);

                if (!chatToDelete) {
                    toast.error("Chat not found.");
                    return;
                }

                const batchUpdates = [];

                // Remove the chat from the current user's userchats document
                batchUpdates.push(
                    updateDoc(userChatsRef, {
                        chats: arrayRemove(chatToDelete),
                    })
                );

                if (receiverChatsSnap.exists()) {
                    const receiverChatsData = receiverChatsSnap.data();
                    const chatToRemove = receiverChatsData.chats.find(chat => chat.receiverId === currentUser.id);

                    if (chatToRemove) {
                        // Remove the chat from the receiver's userchats document
                        batchUpdates.push(
                            updateDoc(receiverChatsRef, {
                                chats: arrayRemove(chatToRemove),
                            })
                        );
                    }
                }

                // Delete the chat from the chats collection
                const chatRef = doc(db, "chats", chatToDelete.chatId);
                batchUpdates.push(deleteDoc(chatRef));

                await Promise.all(batchUpdates);

                toast.success("Chat deleted successfully!");
                resetChat();
            } else {
                toast.error("No chats found for this user.");
            }
        } catch (error) {
            console.error("Error deleting chat: ", error);
            toast.error("Error deleting chat.");
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
                <p>{user?.slogan || "Here should be status phrase of the user!"}</p>
            </div>
            <div className="info">
                <Accordion expanded={expanded === "panel1"} onChange={handleAccordionChange("panel1")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Chat Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="privacy-help-content">
                            <ConfirmationDialog
                                text="Are you sure to delete this chat?"
                                btnText="Delete the chat"
                                onConfirm={handleDeleteChat}
                            />
                            <ConfirmationDialog
                                text={
                                    isReceiverBlocked
                                        ? "Are you sure to unblock the user?"
                                        : "Are you sure to block the user?"
                                }
                                btnText={
                                    isCurrentUserBlocked
                                        ? "You are blocked!"
                                        : isReceiverBlocked
                                          ? "You blocked this user! Click again to unblock."
                                          : "Block the user"
                                }
                                onConfirm={handleBlock}
                                disabled={isCurrentUserBlocked}
                            />
                        </div>
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
                        {sharedPhotos.length === 0 && <div className="no-data">No photos yet.</div>}
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === "panel3"} onChange={handleAccordionChange("panel3")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Shared Files</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="files">
                            {sharedFiles.map((file, index) => (
                                <div className="file-item" key={index}>
                                    <Button
                                        variant="outlined"
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="file-icon">
                                            <img id="icon" src={`${publicUrl}/file.svg`} alt="" />
                                            <Typography>{file.name}</Typography>
                                        </div>
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {sharedFiles.length === 0 && <div className="no-data">No files yet.</div>}
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
            </div>
        </div>
    );
};

export default Detail;
