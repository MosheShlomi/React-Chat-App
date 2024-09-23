import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";

export const imageUpload = async file => {
    const date = new Date();
    const storageRef = ref(storage, `images/${date + file.name}`);
    return upload(storageRef, file);
};

export const fileUpload = async file => {
    const storageRef = ref(storage, `files/${file.name}`);
    return upload(storageRef, file);
};

export const audioUpload = async file => {
    const date = new Date();
    const storageRef = ref(storage, `audio/${date + file.name}`);
    return upload(storageRef, file);
};

const upload = async (storageRef, file) => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    let toastId = null;

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

                const text = "Upload is: " + progress + "% done";
                if (toastId === null) {
                    toastId = toast.success(text, { autoClose: false });
                } else {
                    toast.update(toastId, { render: text });
                }
            },
            error => {
                reject("Something went wrong!" + error);
                toast.error("Upload failed!");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    resolve(downloadURL);
                });
                toast.dismiss(toastId);
            }
        );
    });
};
