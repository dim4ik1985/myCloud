import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  getUserFiles,
  usersAdminState,
  deleteUserFiles
} from "../../../store/slices/AdminSlice.ts";
import { IFile } from "../../../models";
import { File } from "../File";
import Box from "@mui/material/Box";
import "./userFiles.css";

export const UserFiles = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { files, deleteFileCheck } = useAppSelector(usersAdminState);

  const handlerDeleteFile = (fileId: number) => {
    dispatch(deleteUserFiles(fileId));
    return;
  };

  useEffect(() => {
    dispatch(getUserFiles(+id!));
  }, [dispatch, deleteFileCheck]);

  return (
    <>
      <Box sx={{ margin: "10px" }}>
        <button className={"btn__back"} onClick={() => window.history.back()}>
          Назад
        </button>
        <ul className={"file__list"}>
          {files.map((file: IFile) => (
            <File file={file} key={file.id} handlerDeleteFile={handlerDeleteFile} />
          ))}
        </ul>
      </Box>
    </>
  );
};
