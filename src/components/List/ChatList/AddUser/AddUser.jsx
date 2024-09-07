import React, { useState } from "react";
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
                />

                <button>Search</button>
            </form>
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
                              <button onClick={() => handleAddUser(user.id)}>Add User</button>
                          )}
                      </div>
                  ))
                : searchPerformed && <p className="no-users-info">No users found.</p>}
        </div>
    );
};

export default AddUser;
