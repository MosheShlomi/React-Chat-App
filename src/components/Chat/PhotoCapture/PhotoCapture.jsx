import React, { useRef, useState } from "react";
import "./photoCapture.scss";
import { toast } from "react-toastify";

const PhotoCapture = props => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [file, setFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = () => {
        setShowCamera(true);
        setCapturedImage(null);
        setFile(null);
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                console.error("Error accessing the camera: ", err);
            });
    };

    const stopCamera = () => {
        if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const capturePhoto = () => {
        try {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext("2d");

            if (!canvas || !video || !context) {
                toast.error("Canvas or video element is not available.");
                throw new Error("Canvas or video element is not available.");
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                const file = new File([blob], new Date() + " - Captured.png", { type: "image/png" });

                const imageUrl = URL.createObjectURL(file);

                setShowCamera(false);
                setCapturedImage(imageUrl);
                setFile(file);
            }, "image/png");
        } catch (error) {
            console.error("Error capturing photo: ", error.message);
            toast.error("Error capturing photo: ", error.message);
        }
    };

    const sendPhoto = () => {
        stopCamera();
        const syntheticEvent = {
            target: {
                files: [file],
            },
        };
        props.handlePhoto(syntheticEvent);
        setCapturedImage(null);
    };

    return (
        <div>
            <div className="video-window" style={{ display: showCamera ? "flex" : "none" }}>
                <video ref={videoRef} />
                <img src="./photo-capture.svg" className="action-icon" alt="" onClick={capturePhoto} />
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
            <div className="preview-window" style={{ display: !showCamera && capturedImage ? "flex" : "none" }}>
                <div className="preview-window-box">
                    <img src={capturedImage} className="show-captured-photo" alt="Captured" />
                    <div className="icons-box">
                        <img src="./done.png" className="action-icon" onClick={sendPhoto} alt="" />
                        <img src="./retake-photo.png" className="action-icon" onClick={startCamera} alt="" />
                    </div>
                </div>
            </div>

            <img src="/camera.png" alt="" onClick={startCamera} />
        </div>
    );
};

export default PhotoCapture;
