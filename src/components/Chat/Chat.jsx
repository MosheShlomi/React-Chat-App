import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import "./chat.scss";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import PhotoCapture from "./PhotoCapture/PhotoCapture";
import VoiceCapture from "./VoiceCapture/VoiceCapture";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const Chat = props => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [chat, setChat] = useState(null);
    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();
    const endRef = useRef(null);
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

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
        if (img.file) {
            handleSend();
        }
    }, [img]);

    useEffect(() => {
        const interval = setInterval(() => {
            setChat(prev => ({ ...prev }));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleEmojiClick = e => {
        setText(prev => prev + e.emoji);
        setOpen(false);
    };

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (text === "" && !img.file) return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIds = [currentUser.id, user.id];

            userIds.forEach(async id => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }

        setImg({
            file: null,
            url: "",
        });

        setText("");
    };

    const handleEnter = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAudio = async e => {
        if (!e.target.files[0]) return;

        const audioFile = e.target.files[0];
        let audioUrl = null;

        try {
            audioUrl = await upload(audioFile);

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    audio: audioUrl,
                    createdAt: new Date(),
                }),
            });

            const userIds = [currentUser.id, user.id];
            userIds.forEach(async id => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = "Audio Message";
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.error("Error sending audio message:", err);
        }
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img
                        src={
                            user.avatar && !isCurrentUserBlocked && !isReceiverBlocked
                                ? user.avatar
                                : `${publicUrl}/avatar.png`
                        }
                        alt=""
                    />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.status || "Here should be status phrase of the user!"}</p>
                    </div>
                </div>

                <div className="icons">
                    <img src={`${publicUrl}/phone.png`} alt="" />
                    <img src={`${publicUrl}/video.png`} alt="" />
                    <img src={`${publicUrl}/info.png`} alt="" onClick={props.handleOpenDetails} />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map(message => (
                    <div
                        className={`message ${message.senderId === currentUser?.id ? "own" : ""}`}
                        key={message?.createdAt?.seconds}
                    >
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            {message.audio && <audio controls src={message.audio}></audio>}
                            {message.text && <p>{message.text}</p>}
                        </div>
                        <span>{formatTimeAgo(message.createdAt)}</span>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <img src={img.url} alt="" />
                    </div>
                )}
                <div ref={endRef}></div>
            </div>

            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src={`${publicUrl}/img.png`} alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <PhotoCapture handlePhoto={handleImg} />
                    <VoiceCapture handleAudio={handleAudio} />
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
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleEnter}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    <div className="emoji">
                        <img src={`${publicUrl}/emoji.png`} alt="" onClick={() => setOpen(prev => !prev)} />
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
                        </div>
                    </div>
                </div>
                <button
                    className="sendButton"
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
