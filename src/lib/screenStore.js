import { create } from "zustand";

const useScreenStore = create(set => ({
    isMobile: false,
    activeSection: "list",
    setIsMobile: isMobile => set({ isMobile }),
    setActiveSection: section => set({ activeSection: section }),
}));

export default useScreenStore;
