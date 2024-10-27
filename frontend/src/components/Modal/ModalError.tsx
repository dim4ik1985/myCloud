import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../../hooks";
import { errorReset } from "../../store/slices/formSlice.ts";
import { IModalErrorProps } from "../../models";
import { errorUserReset } from "../../store/slices/userLoginSlice.ts";
import { errorFilesReset } from "../../store/slices/filesSlice.ts";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4
};

export const ModalError = (props: IModalErrorProps) => {
  const { title, message } = props;
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    dispatch(errorReset());
    dispatch(errorUserReset());
    dispatch(errorFilesReset());
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {message}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
