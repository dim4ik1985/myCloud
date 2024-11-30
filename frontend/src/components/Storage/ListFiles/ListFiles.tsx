import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { purple } from "@mui/material/colors";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

import { IFile } from "../../../models";
import Tooltip from "@mui/material/Tooltip";
import classes from "./listFiles.module.css";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  deleteFiles,
  downloadFilesLink,
  fileState,
  getFiles,
  renameFiles,
  modalActions,
  renameComment
} from "../../../store/slices/filesSlice.ts";
import { isExtensionFile } from "../../../helpers";
import { userLoginState } from "../../../store/slices/userLoginSlice.ts";
import { ModalRename } from "../../Modal/ModalRename";
import moment from "moment";
import { FadeMenu } from "../FileItem";

interface IListFilesProps {
  files: IFile[];
}

export const ListFiles = (props: IListFilesProps) => {
  const { files } = props;
  const { isAuthenticated } = useAppSelector(userLoginState);
  const { deleteCheck, renameCheck, downloadLink } = useAppSelector(fileState);

  const dispatch = useAppDispatch();

  const [modalCategory, setModalCategory] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentFile, setCurrentFile] = useState<number | null>(null);
  const [oldName, setOldName] = useState("");
  const [disabled, setDisabled] = useState(true);
  // const [url_link, setUrl_link] = useState("");

  const handlerChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value);
    if (event.target.value !== "") {
      setDisabled(false);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentFile) {
      if (modalCategory === "renameFile") {
        const getData: { name: string; fileId: number } = {
          name: currentName + "." + isExtensionFile(oldName),
          fileId: currentFile
        };
        dispatch(renameFiles(getData));
      }

      if (modalCategory === "renameComment") {
        const getData: { commentary: string; fileId: number } = {
          commentary: currentName,
          fileId: currentFile
        };
        dispatch(renameComment(getData));
      }
    } else {
      console.error("currentFile is null");
    }
    dispatch(modalActions(false));
    setModalCategory("");
    setCurrentName("");
    setCurrentFile(null);
    setDisabled(true);
    setOldName("");
    (e.target as HTMLFormElement).reset();
  };

  const handlerRenameFile = (file: IFile) => {
    setModalCategory("renameFile");
    dispatch(modalActions(true));
    setCurrentFile(file?.id ?? null);
    setOldName(file?.name ?? "");
  };

  const handlerDeleteFile = (id: number) => {
    dispatch(deleteFiles(id));
  };

  const handlerOpenFileLink = (file_id: number) => {
    if (!navigator.clipboard) {
      alert("Clipboard API is not available.");
      return;
    }
    setModalCategory("UploadUrl");
    handleDownload(file_id);
  };

  const handleDownload = (id: number) => {
    dispatch(downloadFilesLink(id));
  };

  useEffect(() => {
    if (deleteCheck && isAuthenticated) {
      dispatch(getFiles());
    }
  }, [deleteCheck, dispatch]);

  useEffect(() => {
    if (renameCheck && isAuthenticated) {
      dispatch(getFiles());
    }
  }, [dispatch, renameCheck]);

  useEffect(() => {
    if (downloadLink) {
      dispatch(modalActions(true));
    }
  }, [dispatch, downloadLink]);

  return (
    <>
      {files.length === 0 && <p className={classes["no-files"]}>Файлы отсутствуют</p>}
      {files.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ marginTop: "50px" }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: purple[700], textTransform: "uppercase" }}>
                    имя файла
                  </TableCell>
                  <TableCell align="center" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    комментарий
                  </TableCell>
                  <TableCell align="center" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    размер
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    дата загрузки
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    дата последнего скачивания
                  </TableCell>
                  <TableCell align="center" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    Управление файлами
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.length > 0 &&
                  files.map((file) => (
                    <TableRow
                      key={file.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "context-menu"
                      }}
                    >
                      <TableCell
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 6px",
                          maxWidth: "200px",
                          overflow: "hidden"
                        }}
                        component="th"
                        scope="row"
                      >
                        {file.name}
                      </TableCell>

                      <TableCell
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                      >
                        <p>{file.commentary}</p>
                        <div>
                          <Tooltip title={"Изменить комментарий"}>
                            <DriveFileRenameOutlineIcon
                              sx={{
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                                boxShadow:
                                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                                borderRadius: "5px",
                                padding: "2px 0",
                                width: "100px",
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.08)"
                                },
                                "&:active": {
                                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                                  boxShadow: "0 0 0 0"
                                }
                              }}
                              onClick={() => {
                                setModalCategory("renameComment");
                                setCurrentFile(file?.id ?? null);
                                dispatch(modalActions(true));
                              }}
                            />
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 6px"
                        }}
                        align="center"
                      >{`${(+file!.size! / 1024 / 1024).toFixed(2)} Mb`}</TableCell>
                      <TableCell sx={{ width: "150px" }} align="right">
                        {moment(file.created_at).format("DD.MM.YYYY, hh:mm a")}
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 6px",
                          width: "150px"
                        }}
                        align="right"
                      >
                        {file.last_download_at
                          ? moment(file.last_download_at).endOf("minutes").fromNow()
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ width: "200px" }} align="center">
                        <FadeMenu
                          file={file}
                          handlerDeleteFile={handlerDeleteFile}
                          handlerRenameFile={handlerRenameFile}
                          handlerOpenFileLink={handlerOpenFileLink}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <ModalRename
            url_link={downloadLink}
            modalCategory={modalCategory}
            disabled={disabled}
            onChangeName={handlerChangeName}
            onSubmit={handleRenameSubmit}
          />
        </>
      )}
    </>
  );
};
