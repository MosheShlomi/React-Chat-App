import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "react-chat-app-7dc90.firebaseapp.com",
    projectId: "react-chat-app-7dc90",
    storageBucket: "react-chat-app-7dc90.appspot.com",
    messagingSenderId: "539575811516",
    appId: "1:539575811516:web:36b9cb71f1c27f92493fb9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export const getErrorText = code => {
    let errorMessage = "";
    switch (code) {
        // User-related errors
        case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
        case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
        case "auth/invalid-email":
            errorMessage = "Invalid email format.";
            break;
        case "auth/user-disabled":
            errorMessage = "User account is disabled.";
            break;

        // Sign-Up errors
        case "auth/email-already-in-use":
            errorMessage = "This email is already in use. Please use a different email.";
            break;
        case "auth/weak-password":
            errorMessage = "Password is too weak. Please use a stronger password.";
            break;
        case "auth/operation-not-allowed":
            errorMessage = "This operation is not allowed. Please contact support.";
            break;

        // Re-authentication & Password reset errors
        case "auth/requires-recent-login":
            errorMessage = "This operation requires recent login. Please log in again and retry.";
            break;
        case "auth/user-mismatch":
            errorMessage = "The credentials do not match the previously signed-in user.";
            break;
        case "auth/credential-already-in-use":
            errorMessage = "This credential is already associated with another account.";
            break;
        case "auth/invalid-credential":
            errorMessage = "The supplied credential is invalid. Please try again.";
            break;
        case "auth/invalid-verification-code":
            errorMessage = "Invalid verification code. Please try again.";
            break;
        case "auth/invalid-verification-id":
            errorMessage = "Invalid verification ID. Please try again.";
            break;

        // Network & Quota errors
        case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection and try again.";
            break;
        case "auth/too-many-requests":
            errorMessage = "Too many requests. Please wait a moment and try again.";
            break;
        case "auth/quota-exceeded":
            errorMessage = "Quota exceeded. Please try again later.";

        // Miscellaneous errors
        case "auth/app-not-authorized":
            errorMessage =
                "This app is not authorized to use Firebase Authentication. Please check your configuration.";
            break;
        case "auth/unauthorized-domain":
            errorMessage =
                "This domain is not authorized to perform this operation. Please check your Firebase settings.";
            break;
        case "auth/invalid-api-key":
            errorMessage = "Your API key is invalid. Please check your Firebase project settings.";
            break;
        case "auth/api-key-revoked":
            errorMessage = "Your API key has been revoked. Please generate a new one in your Firebase project.";
            break;

        default:
            errorMessage = error.message;
    }

    return errorMessage;
};
