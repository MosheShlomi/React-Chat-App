import React from "react";
import "./detail.scss";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const handleBlock = async e => {
        if (!user) {
            return;
        }

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });

            changeBlock();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || `${publicUrl}/avatar.png`} alt="" />
                <h2>{user?.username}</h2>
                <p>{user?.status || "Here should be status phrase of the user!"}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src={`${publicUrl}/arrowUp.png`} alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src={`${publicUrl}/arrowUp.png`} alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src={`${publicUrl}/arrowDown.png`} alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src={`${publicUrl}/bg.jpg`} alt="" />
                                <span>photo.png</span>
                            </div>
                            <img src={`${publicUrl}/download.jpg`} alt="" className="downloadIcon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src={`${publicUrl}/bg.jpg`} alt="" />
                                <span>photo.png</span>
                            </div>
                            <img src={`${publicUrl}/download.jpg`} alt="" className="downloadIcon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src={`${publicUrl}/bg.jpg`} alt="" />
                                <span>photo.png</span>
                            </div>
                            <img src={`${publicUrl}/download.jpg`} alt="" className="downloadIcon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src={`${publicUrl}/bg.jpg`} alt="" />
                                <span>photo.png</span>
                            </div>
                            <img src={`${publicUrl}/download.jpg`} alt="" className="downloadIcon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src={`${publicUrl}/arrowUp.png`} alt="" />
                    </div>
                </div>

                <button onClick={handleBlock}>
                    {isCurrentUserBlocked
                        ? "You are blocked!"
                        : isReceiverBlocked
                          ? "You blocked this user! Click again to unblock."
                          : "Block user!"}
                </button>
                <button className="logout" onClick={() => auth.signOut()}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Detail;
