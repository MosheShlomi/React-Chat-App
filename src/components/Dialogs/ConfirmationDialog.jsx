import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "./confirmationDialog.scss";
const ConfirmationDialog = props => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        handleClose();
        props.onConfirm();
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen} disabled={props?.disabled || false}>
                {props.btnText}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div className="confirmation-dialog">
                    <DialogTitle id="alert-dialog-title">{props.text}</DialogTitle>
                    <DialogContent id="alert-dialog-content">
                        <Button onClick={handleClose} variant="outlined" color="error">
                            No
                        </Button>
                        <Button onClick={handleConfirm} autoFocus variant="outlined" color="success">
                            Yes
                        </Button>
                    </DialogContent>
                </div>
            </Dialog>
        </React.Fragment>
    );
};

export default ConfirmationDialog;
