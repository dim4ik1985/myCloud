import "./modalRename.css";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { copyLinkActions, fileState, modalActions } from "../../../store/slices/filesSlice.ts";

import { TextField } from "@mui/material";
import { ModalButton } from "../../ModalButton";

import Button from "@mui/material/Button";
import { SnackBarModal } from "../../SnackBarModal";

interface IModalRenameProps {
  modalCategory: string;
  url_link?: string;
  disabled?: boolean;
  onChangeName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ModalRename = (props: IModalRenameProps) => {
  const { modalCategory, url_link, disabled, onChangeName, onSubmit } = props;
  const dispatch = useAppDispatch();
  const { modalRename, copyLinkCheck, renameCheck, deleteCheck } = useAppSelector(fileState);

  const [message, setMessage] = useState<string>("");

  const handlerCopyLink = async (url_link: string) => {
    try {
      await navigator.clipboard.writeText(url_link);
      dispatch(copyLinkActions(true));
      dispatch(modalActions(false));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (modalCategory === "renameFile") {
      setMessage("Файл переименован");
    }
    if (modalCategory === "renameComment") {
      setMessage("Комментарий переименован");
    }
  }, [modalCategory]);

  return (
    <>
      <div
        className={modalRename ? "modal" : "active"}
        onClick={() => dispatch(modalActions(false))}
      >
        <div
          className={"modal__content"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {modalCategory === "UploadUrl" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p>Ссылка для скачивания</p>
              <TextField
                id="outlined-basic"
                multiline
                rows={2}
                defaultValue={url_link}
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                sx={{ width: "500px", marginBottom: "20px", borderRadius: "25px" }}
              />
              <Button
                variant="contained"
                type={"button"}
                disabled={!navigator.clipboard}
                sx={{ margin: "5px 0 20px 0", borderRadius: "25px" }}
                onClick={() => handlerCopyLink(url_link!)}
              >
                Скопировать ссылку
              </Button>
            </div>
          ) : (
            <form
              className={modalRename ? "form__rename" : "close"}
              method="patch"
              onSubmit={onSubmit}
            >
              <TextField
                id="outlined-basic"
                label={modalCategory === "renameFile" ? "Новое имя" : "Новый комментарий"}
                variant="outlined"
                sx={{ marginBottom: "20px", borderRadius: "25px" }}
                onChange={onChangeName}
              />
              <ModalButton type={"submit"} disabled={disabled} label={"Переименовать"} />
            </form>
          )}
        </div>
      </div>
      {copyLinkCheck && (
        <div>
          <SnackBarModal action={copyLinkCheck} message="Ссылка скопирована" />
        </div>
      )}
      {renameCheck && (
        <div>
          <SnackBarModal action={renameCheck} message={message} />
        </div>
      )}
      {deleteCheck && (
        <div>
          <SnackBarModal action={deleteCheck} message="Файл удален" />
        </div>
      )}
    </>
  );
};
