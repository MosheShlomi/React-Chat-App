import React, { useRef, useState, useEffect } from "react";
import "./voiceCapture.scss";
import { toast } from "react-toastify";

const VoiceCapture = props => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [file, setFile] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const startRecording = () => {
        setIsRecording(true);
        setAudioURL(null);
        setFile(null);
        setRecordingTime(0);
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = event => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                    const audioFile = new File([audioBlob], new Date() + " - Recorded.wav", { type: "audio/wav" });
                    const audioUrl = URL.createObjectURL(audioFile);

                    setAudioURL(audioUrl);
                    setFile(audioFile);
                    clearInterval(timerRef.current);
                };

                mediaRecorderRef.current.start();
                startTimer();
            })
            .catch(err => {
                console.error("Error accessing the microphone: ", err);
                toast.error("Error accessing the microphone: " + err.message);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setRecordingTime(prevTime => prevTime + 1);
        }, 1000);
    };

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const sendAudio = () => {
        stopRecording();
        const syntheticEvent = {
            target: {
                files: [file],
            },
        };
        props.handleAudio(syntheticEvent);
        setAudioURL(null);
    };

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div>
            <div className="audio-window" style={{ display: isRecording ? "block" : "none" }}>
                <button id="speech" className="btn" onClick={stopRecording}>
                    <div className="pulse-ring"></div>
                    <img src={`${publicUrl}/mic.png`} alt="" />
                </button>

                <div className="timer">{formatTime(recordingTime)}</div>
            </div>

            <div className="audio-window" style={{ display: !isRecording && audioURL ? "flex" : "none" }}>
                <div className="preview-window-box">
                    <audio controls src={audioURL} className="show-recorded-audio"></audio>
                    <div className="icons-box">
                        <img src={`${publicUrl}/done.png`} className="action-icon" onClick={sendAudio} alt="Send" />
                        <img
                            src={`${publicUrl}/repeat.png`}
                            className="action-icon"
                            onClick={startRecording}
                            alt="Retake"
                        />
                    </div>
                </div>
            </div>

            <img src={`${publicUrl}/mic.png`} alt="Start Recording" onClick={startRecording} />
        </div>
    );
};

export default VoiceCapture;
