import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./chat.scss";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { imageUpload, fileUpload, audioUpload } from "../../lib/upload";
import PhotoCapture from "./PhotoCapture/PhotoCapture";
import VoiceCapture from "./VoiceCapture/VoiceCapture";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import Audio from "./Audio/Audio";
import FileAttach from "./FileAttach/FileAttach";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import useScreenStore from "../../lib/screenStore";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "@mui/material";

const values = {
    image: "Image",
    application: "File",
    audio: "Audio Message",
};

const Chat = props => {
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [imgDialogOpen, setImgDialogOpen] = useState(false);
    const [messageSending, setMessageSending] = useState(false);
    const [dialogImg, setDialogImg] = useState(null);
    const [text, setText] = useState("");
    const [chat, setChat] = useState(null);
    const [fileData, setFileData] = useState(null);
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { isMobile, setActiveSection } = useScreenStore();
    const { currentUser } = useUserStore();
    const endRef = useRef(null);
    const inputRef = useRef(null);

    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), res => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    useEffect(() => {
        if (fileData) {
            handleSend();
        }
    }, [fileData]);

    const handleEmojiClick = e => {
        setText(prev => prev + e.emoji);
        setEmojiPickerOpen(false);
        inputRef.current?.focus();
    };

    const showToastV2 = () => {
        toast.info("This functionallity will be able in V2!");
    };

    const handleSend = async () => {
        if (text === "" && !fileData) return;

        let fileUrl = null;
        let fileType = null;

        try {
            if (fileData) {
                fileType = fileData.type.split("/")[0]; // Checks if it's an image, document or audio
                setMessageSending(true);
                switch (fileType) {
                    case "image":
                        fileUrl = await imageUpload(fileData);
                        break;
                    case "application":
                        fileUrl = await fileUpload(fileData);
                        break;
                    case "audio":
                        fileUrl = await audioUpload(fileData);
                        break;
                }
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(fileType === "image" && { img: fileUrl }),
                    ...(fileType === "audio" && { audio: fileUrl }),
                    ...(fileType === "application" && { file: fileUrl, fileName: fileData.name }),
                }),
            });

            const userIds = [currentUser.id, user.id];
            userIds.forEach(async id => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = fileType ? values[fileType] : text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
            setMessageSending(false);
        } catch (err) {
            console.error(err);
        }

        setFileData(null);
        setText("");
    };

    const handleEnter = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFile = file => {
        if (file) {
            setFileData(file);
        }
    };

    const openImgDialog = img => {
        setDialogImg(img);
        setImgDialogOpen(true);
    };

    const closeImgDialog = () => {
        setDialogImg(null);
        setImgDialogOpen(false);
    };

    const handleBackButton = () => {
        setActiveSection("list");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    {isMobile && (
                        <div className="back-home-btn">
                            <Button variant="outlined" onClick={handleBackButton}>
                                <ArrowBackIosIcon />
                            </Button>
                        </div>
                    )}
                    <img
                        src={
                            user.avatar && !isCurrentUserBlocked && !isReceiverBlocked
                                ? user.avatar
                                : `${publicUrl}/avatar.png`
                        }
                        alt=""
                        onClick={props.handleOpenDetails}
                    />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.slogan || "Here should be status phrase of the user!"}</p>
                    </div>
                </div>

                <div className="icons">
                    <img src={`${publicUrl}/phone.png`} alt="" onClick={showToastV2} />
                    <img src={`${publicUrl}/video.png`} alt="" onClick={showToastV2} />
                    <img src={`${publicUrl}/info.png`} alt="" onClick={props.handleOpenDetails} />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div
                        className={`message ${message.senderId === currentUser?.id ? "own" : ""}`}
                        key={message?.createdAt?.toMillis?.() || index}
                    >
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" onClick={() => openImgDialog(message.img)} />}
                            {message.audio && <Audio src={message.audio} />}
                            {message.file && (
                                <a href={message.file} target="_blank" rel="noopener noreferrer">
                                    <div className="file-icon">
                                        <img id="icon" src={`${publicUrl}/file.svg`} alt="" />
                                        {message.fileName}
                                    </div>
                                </a>
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                        <span>{formatTimeAgo(message.createdAt)}</span>
                    </div>
                ))}
                <div ref={endRef}></div>

                {chat?.messages.length === 0 && <div className="no-messages-info">Enter your first message!</div>}
            </div>

            <div className="bottom" disabled={messageSending || isCurrentUserBlocked || isReceiverBlocked}>
                <div className="icons">
                    <FileAttach handleFile={handleFile} />
                    <PhotoCapture handlePhoto={handleFile} />
                    <VoiceCapture handleAudio={handleFile} />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder={
                            isCurrentUserBlocked || isReceiverBlocked
                                ? "You can't send a message!"
                                : "Type a message..."
                        }
                        value={text}
                        ref={inputRef}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleEnter}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    {!isMobile && (
                        <div className="emoji">
                            <img
                                src={`${publicUrl}/emoji.png`}
                                alt=""
                                onClick={() => setEmojiPickerOpen(prev => !prev)}
                            />
                            <div className="picker">
                                <EmojiPicker open={emojiPickerOpen} onEmojiClick={handleEmojiClick} />
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="sendButton"
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                    Send
                </button>
            </div>
            <Dialog
                open={imgDialogOpen}
                onClose={closeImgDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
            >
                <img src={dialogImg} alt="" />
            </Dialog>
        </div>
    );
};

export default Chat;
