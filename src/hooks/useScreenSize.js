// hooks/useScreenSize.js
import { useEffect } from "react";
import useScreenStore from "../lib/screenStore";

const useScreenSize = () => {
    const setIsMobile = useScreenStore(state => state.setIsMobile);
    const setActiveSection = useScreenStore(state => state.setActiveSection);

    useEffect(() => {
        // Define a function to check screen width and update the store
        const handleResize = () => {
            const isMobile = window.innerWidth <= 800;
            setIsMobile(isMobile);

            // Reset active section to 'list' if switching to mobile
            if (isMobile) {
                setActiveSection("list");
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsMobile, setActiveSection]);
};

export default useScreenSize;
