import { useEffect } from "react";
import useScreenStore from "../lib/screenStore";

const useScreenSize = () => {
    const { setIsMobile, setActiveSection } = useScreenStore();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 800;
            setIsMobile(isMobile);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsMobile, setActiveSection]);
};

export default useScreenSize;
