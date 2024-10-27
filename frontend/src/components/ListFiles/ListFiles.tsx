import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { grey, pink, purple } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";

import { IFile } from "../../models";
import Tooltip from "@mui/material/Tooltip";
import classes from "../ListFiles/listFiles.module.css";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  deleteFiles,
  downloadFiles,
  fileState,
  getFiles,
  renameFiles,
  modalActions,
  renameComment
} from "../../store/slices/filesSlice.ts";
import { isExtensionFile } from "../../helpers";
import { userLoginState } from "../../store/slices/userLoginSlice.ts";
import { ModalRename } from "../Modal/ModalRename";

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

  const handlerChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value);
    console.log(currentName);
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

  const handleDelete = (id: number) => {
    dispatch(deleteFiles(id));
  };

  const handleDownload = (id: number) => {
    dispatch(downloadFiles(id));
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
      console.log(downloadLink);
      window.open(downloadLink, "_blank");
      dispatch(getFiles());
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
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    комментарий
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    размер
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    дата загрузки
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    дата последнего скачивания
                  </TableCell>
                  <TableCell align="right" sx={{ color: purple[700], textTransform: "uppercase" }}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.length > 0 &&
                  files.map((file) => (
                    <TableRow
                      key={file.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {file.name}
                      </TableCell>
                      <TableCell align="right">
                        {file.commentary}
                        <DriveFileRenameOutlineIcon
                          onClick={() => {
                            setModalCategory("renameComment");
                            setCurrentFile(file?.id ?? null);
                            dispatch(modalActions(true));
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">{`${Math.round(file.size / 1024)} Kb`}</TableCell>
                      <TableCell align="right">{file.created_at}</TableCell>
                      <TableCell align="right">{file.last_download_at}</TableCell>
                      <TableCell align="center">
                        {
                          <Tooltip title={"Удалить"}>
                            <DeleteIcon
                              sx={{ color: pink[500] }}
                              onClick={() => file?.id && handleDelete(file.id)}
                            />
                          </Tooltip>
                        }
                        {
                          <Tooltip sx={{ position: "relative" }} title={"Переименовать"}>
                            <DriveFileRenameOutlineIcon
                              sx={{ color: grey }}
                              onClick={() => {
                                setModalCategory("renameFile");
                                dispatch(modalActions(true));
                                setCurrentFile(file?.id ?? null);
                                setOldName(file?.name ?? "");
                              }}
                            />
                          </Tooltip>
                        }
                        {
                          <Tooltip title={"Просмотр"}>
                            <Link
                              href={`http://localhost:8000${file.file}`}
                              underline="hover"
                              target="_blank"
                              download={file.name}
                            >
                              <VisibilityIcon />
                            </Link>
                          </Tooltip>
                        }
                        {
                          <Tooltip title={"Поделиться"}>
                            <ShareIcon onClick={() => file?.id && handleDownload(file.id)} />
                          </Tooltip>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ModalRename
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
