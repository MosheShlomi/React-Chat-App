import React, { useRef, useState, useEffect } from "react";
import "./Audio.scss";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";

const Audio = ({ src }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = event => {
        if (!audioRef.current || !isFinite(audioRef.current.duration)) {
            return;
        }

        const newCurrentTime = (event.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newCurrentTime;
        setProgress(event.target.value);
    };

    const handleTimeUpdate = () => {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const handleReplay = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
    };

    useEffect(() => {
        const audio = audioRef.current;

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    return (
        <div className="custom-audio-container">
            <button className="custom-play-pause" onClick={handlePlayPause}>
                {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
            </button>

            <input
                type="range"
                className="custom-progress-bar"
                value={progress}
                onChange={handleProgressChange}
                step="0.1"
                min="0"
                max="100"
            />
            <span className="replay-button">
                <ReplayCircleFilledIcon onClick={handleReplay} />
            </span>

            <audio ref={audioRef} src={src} className="hidden-audio" />
        </div>
    );
};

export default Audio;
