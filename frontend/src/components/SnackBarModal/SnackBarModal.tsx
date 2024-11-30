import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import React from "react";

import { statusReset } from "../../store/slices/filesSlice.ts";
import { useAppDispatch } from "../../hooks";

interface IPropsSnackBarModal {
  action: boolean;
  message: string;
}

export const SnackBarModal = (props: IPropsSnackBarModal) => {
  const { action, message } = props;

  const dispatch = useAppDispatch();

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(statusReset());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={action}
      autoHideDuration={2000}
      onClose={handleClose}
      message={message}
    />
  );
};
