import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set, get) => ({
    currentUser: null,
    isLoading: true,
    isLoggedOut: false,

    fetchUserInfo: async uid => {
        if (!uid) {
            return set({ currentUser: null, isLoading: false, isLoggedOut: true });
        }

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false, isLoggedOut: false });
            } else {
                set({ currentUser: null, isLoading: false, isLoggedOut: true });
            }
        } catch (err) {
            console.log(err);
            return set({ currentUser: null, isLoading: false, isLoggedOut: true });
        }
    },
}));
