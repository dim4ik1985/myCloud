import classes from "./profileScreen.module.css";
import { useNavigate } from "react-router-dom";
import {
  clearProfile,
  errorProfileReset,
  profileCheckUser,
  profileState
} from "../../store/slices/profileSlice.ts";
import { fileState, getFiles, uploadFiles } from "../../store/slices/filesSlice.ts";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { UploadForm } from "../../components/UploadForm";
import { IFile } from "../../models";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  checkToken,
  logoutUser,
  refreshUserToken,
  userLoginState
} from "../../store/slices/userLoginSlice.ts";
import { ListFiles } from "../../components/ListFiles";
import { CircularProgress } from "@mui/material";

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { profile, isLogin, isUserLoading } = useAppSelector(profileState);
  const { files, isLoadingFiles, uploadCheck } = useAppSelector(fileState);
  const { isAuthenticated, errorTokenStatus } = useAppSelector(userLoginState);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedComment, setSelectedComment] = useState<string | undefined>("");

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setSelectedComment(event.target.value);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      (e.target as HTMLFormElement).reset();
      return;
    }

    const fileData: IFile = {
      file: selectedFile,
      name: selectedFile.name,
      size: selectedFile.size,
      commentary: selectedComment
    };

    dispatch(uploadFiles(fileData));
    setSelectedComment("");
    setSelectedFile(null);
    (e.target as HTMLFormElement).reset();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearProfile());
    console.log("logout");
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    if (localStorage.getItem("accessToken")) {
      dispatch(checkToken());
    }

    if (isAuthenticated) {
      dispatch(profileCheckUser());
    }
    if (errorTokenStatus) {
      dispatch(refreshUserToken());
      dispatch(errorProfileReset());
    }
  }, [dispatch, errorTokenStatus, isAuthenticated, navigate]);

  useEffect(() => {
    if (isLogin) {
      dispatch(getFiles());
    }
  }, [dispatch, isLogin]);

  useEffect(() => {
    if (uploadCheck) {
      dispatch(getFiles());
    }
  }, [dispatch, uploadCheck]);

  return (
    <>
      {isUserLoading && <CircularProgress sx={{ position: "fixed", top: "50%", left: "50%" }} />}
      {!isUserLoading && (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color={"default"}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Хранилище
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Home
                </Button>
                {profile.is_staff && (
                  <Button
                    color="inherit"
                    onClick={() => {
                      navigate("/admin");
                    }}
                  >
                    Admin
                  </Button>
                )}
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
          </Box>
          <Box className={classes["wrapper"]}>
            <div className={classes["title"]}>
              Profile <span>{profile?.login}</span>{" "}
            </div>

            <div className={classes["container"]}>
              <UploadForm
                onChangeFile={handleFileChange}
                onChangeComment={handleCommentChange}
                onUpload={handleUpload}
                isLoading={isLoadingFiles}
                selectedFile={selectedFile}
                inputRef={inputRef}
                onChooseFile={onChooseFile}
                onRemoveFile={removeFile}
              />
            </div>

            <ListFiles files={files} />
          </Box>
        </>
      )}
    </>
  );
};
