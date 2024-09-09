import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db, auth } from "./firebase";

export const useUserStore = create(set => ({
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

                // Set up a real-time listener for user data changes
                onSnapshot(docRef, snapshot => {
                    if (snapshot.exists()) {
                        set({ currentUser: snapshot.data() });
                    }
                });
            } else {
                set({ currentUser: null, isLoading: false, isLoggedOut: true });
            }
        } catch (err) {
            console.log(err);
            return set({ currentUser: null, isLoading: false, isLoggedOut: true });
        }
    },

    initializeAuthListener: () => {
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is logged in, fetch user info
                set({ isLoading: true, isLoggedOut: false });
                useUserStore.getState().fetchUserInfo(user.uid);
            } else {
                // User is logged out
                set({ currentUser: null, isLoading: false, isLoggedOut: true });
            }
        });
    },
}));
