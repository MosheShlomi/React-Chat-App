import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Notification = () => {
    return (
        <div className="">
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default Notification;
