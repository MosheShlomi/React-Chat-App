import React, { useState, useEffect } from "react";
import "./chatList.scss";
import AddUser from "./AddUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import Dialog from "@mui/material/Dialog";

const ChatList = () => {
    const [addMode, setAddMode] = useState(false);
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async res => {
            const items = res.data()?.chats;

            if (items) {
                const promises = items.map(async item => {
                    const userDocRef = doc(db, "users", item.receiverId);
                    const userDocSnap = await getDoc(userDocRef);

                    const user = userDocSnap.data();
                    return { ...item, user };
                });

                const chatData = await Promise.all(promises);

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        });
        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async chat => {
        const userChats = chats.map(item => {
            const { user, ...rest } = item;

            return rest;
        });

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src={`${publicUrl}/search.png`} alt="" />
                    <input type="text" placeholder="Search username..." onChange={e => setInput(e.target.value)} />
                </div>
                <img src={`${publicUrl}/edit.png`} className="add" onClick={() => setAddMode(prev => !prev)} alt="" />
            </div>
            {filteredChats.map(chat => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}>
                    <img
                        src={
                            chat.user.blocked.includes(currentUser.id) || !chat.user.avatar
                                ? `${publicUrl}/avatar.png`
                                : chat.user.avatar
                        }
                        alt=""
                    />
                    <div className="texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                        {!chat?.isSeen && <span className="isSeen"></span>}
                    </div>
                </div>
            ))}

            <Dialog onClose={() => setAddMode(prev => !prev)} open={addMode}>
                <AddUser />
            </Dialog>
        </div>
    );
};

export default ChatList;
