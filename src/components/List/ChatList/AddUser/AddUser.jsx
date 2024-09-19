import React, { useState, useEffect, useRef } from "react";
import "./addUser.scss";
import { toast } from "react-toastify";
import { arrayUnion, collection, doc, getDocs, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
    const [users, setUsers] = useState([]);
    const { currentUser } = useUserStore();
    const [searchText, setSearchText] = useState("");
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState({});

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSearch = async e => {
        e.preventDefault();

        const trimmedSearchText = searchText.trim().toLowerCase();

        if (!trimmedSearchText) {
            toast.error("Please enter a username.");
            return;
        }

        try {
            const userRef = collection(db, "users");
            const querySnapShot = await getDocs(userRef);

            const allUsers = querySnapShot.docs.map(doc => doc.data());

            // Filter users whose usernames contain the searchText
            const filteredUsers = allUsers.filter(user => user.username.toLowerCase().includes(trimmedSearchText));

            const userChatsRef = doc(db, "userchats", currentUser.id);
            const userChatsSnapShot = await getDoc(userChatsRef);

            const userChatsData = userChatsSnapShot.exists() ? userChatsSnapShot.data() : {};
            const chats = userChatsData.chats || [];

            const updatedUsers = filteredUsers.map(user => ({
                ...user,
                isAlreadyInChat: chats.some(chat => chat.receiverId === user.id),
            }));

            setUsers(updatedUsers);
            setSearchPerformed(true);
        } catch (err) {
            console.error(err);
            toast.error("Error while searching users!");
        }
    };

    const handleAddUser = async userId => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        setLoadingUsers(prevState => ({ ...prevState, [userId]: true }));

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userChatsRef, userId), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: userId,
                    updatedAt: Date.now(),
                }),
            });

            toast.success("User added successfully!");

            setUsers(prevUsers =>
                prevUsers.map(user => (user.id === userId ? { ...user, isAlreadyInChat: true } : user))
            );
        } catch (err) {
            console.error(err);
            toast.error("Error while adding user!");
        } finally {
            setLoadingUsers(prevState => ({ ...prevState, [userId]: false }));
        }
    };

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    ref={inputRef}
                />

                <button>Search</button>
            </form>
            <div className="users-container">
                {users.length > 0
                    ? users.map(user => (
                          <div key={user.id} className="user">
                              <div className="detail">
                                  <img src={user.avatar || import.meta.env.VITE_PUBLIC_URL + "/avatar.png"} alt="" />
                                  <span>{user.username}</span>
                              </div>
                              {user.isAlreadyInChat ? (
                                  <button disabled className="exist">
                                      Already Added
                                  </button>
                              ) : (
                                  <button onClick={() => handleAddUser(user.id)} disabled={loadingUsers[user.id]}>
                                      {loadingUsers[user.id] ? "Adding..." : "Add User"}
                                  </button>
                              )}
                          </div>
                      ))
                    : searchPerformed && <p className="no-users-info">No users found.</p>}
            </div>
        </div>
    );
};

export default AddUser;
