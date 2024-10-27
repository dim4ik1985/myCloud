import React from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

export const FormButton: React.FC = () => {
  return (
    <>
      <Button
        fullWidth
        variant="contained"
        type={"submit"}
        disableElevation={true}
        sx={{ marginTop: "20px" }}
        endIcon={<SendIcon />}
      >
        Отправить
      </Button>
    </>
  );
};
