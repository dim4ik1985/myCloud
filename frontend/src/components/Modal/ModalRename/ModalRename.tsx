import "./modalRename.css";
import { TextField } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fileState, modalActions } from "../../../store/slices/filesSlice.ts";
import { ModalButton } from "../../ModalButton";

interface IModalRenameProps {
  modalCategory: string;
  disabled: boolean;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ModalRename = (props: IModalRenameProps) => {
  const { modalCategory, disabled, onChangeName, onSubmit } = props;
  const dispatch = useAppDispatch();
  const { modalRename } = useAppSelector(fileState);

  return (
    <div className={modalRename ? "modal" : "active"} onClick={() => dispatch(modalActions(false))}>
      <div
        className={"modal__content"}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form className={modalRename ? "form__rename" : "close"} method="patch" onSubmit={onSubmit}>
          <TextField
            id="outlined-basic"
            label={modalCategory === "renameFile" ? "Новое имя" : "Новый комментарий"}
            variant="outlined"
            sx={{ marginBottom: "20px", borderRadius: "25px" }}
            onChange={onChangeName}
          />
          <ModalButton type={"submit"} disabled={disabled} label={"Переименовать"} />
        </form>
      </div>
    </div>
  );
};
