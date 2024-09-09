import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create(set => {
    const handleLogout = () => {
        set({
            chatId: null,
            user: null,
            isCurrentUserBlocked: false,
            isReceiverBlocked: false,
        });
    };

    useUserStore.subscribe(state => {
        if (state.isLoggedOut) {
            handleLogout();
        }
    });

    return {
        chatId: null,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,

        changeChat: (chatId, user) => {
            const currentUser = useUserStore.getState().currentUser;

            //! Check if current user is blocked
            if (user.blocked.includes(currentUser.id)) {
                return set({
                    chatId,
                    user,
                    isCurrentUserBlocked: true,
                    isReceiverBlocked: false, // if currentUser blocked him
                });
            }

            //! Check if receiver user is blocked
            else if (currentUser.blocked.includes(user.id)) {
                return set({
                    chatId,
                    user,
                    isCurrentUserBlocked: false,
                    isReceiverBlocked: true,
                });
            } else {
                return set({
                    chatId,
                    user,
                    isCurrentUserBlocked: false,
                    isReceiverBlocked: false,
                });
            }
        },

        changeBlock: () => {
            set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
        },

        resetChat: () => {
            return set(state => ({
                ...state,
                user: null,
                chatId: null,
            }));
        },
    };
});
