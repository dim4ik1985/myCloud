import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import "./admin.css";

import { useNavigate } from "react-router-dom";
import {
  checkToken,
  logoutUser,
  refreshUserToken,
  userLoginState
} from "../../store/slices/userLoginSlice.ts";

import {
  clearProfile,
  errorProfileReset,
  profileCheckUser,
  profileState
} from "../../store/slices/profileSlice.ts";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";

import { IUser } from "../../models";

import { CircularProgress } from "@mui/material";

import {
  changeRoleUser,
  deleteUser,
  getUsers,
  usersAdminState
} from "../../store/slices/AdminSlice.ts";
import { User } from "../../components/Admin/User";

export const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, errorTokenStatus } = useAppSelector(userLoginState);
  const profile = useAppSelector(profileState);
  const { users, changeRoleCheck, deleteUserCheck, isLoadingAdmin } =
    useAppSelector(usersAdminState);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearProfile());
  };

  const handlerRoleChange = (user: IUser) => {
    const getData: { userId: number; role: boolean } = { userId: user.id!, role: !user.is_staff };
    dispatch(changeRoleUser(getData));
  };

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUser(userId));
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
      dispatch(getUsers());
    }
    if (errorTokenStatus) {
      dispatch(refreshUserToken());
      dispatch(errorProfileReset());
    }
  }, [dispatch, errorTokenStatus, isAuthenticated, navigate]);

  useEffect(() => {
    if (changeRoleCheck) {
      dispatch(getUsers());
    }
  }, [changeRoleCheck, dispatch]);

  useEffect(() => {
    if (deleteUserCheck) {
      dispatch(getUsers());
    }
  }, [deleteUserCheck, dispatch]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color={"default"}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Административная панель
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/profile");
              }}
            >
              Storage
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {isLoadingAdmin && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <ul style={{ listStyle: "none", margin: "100px 15px 0 15px", padding: "0" }}>
        {users
          .filter((user) => user.id !== profile.profile.id)
          .filter((user) => !user.is_superuser)
          .map((user) => (
            <User
              key={user.id}
              user={user}
              handlerRoleChange={handlerRoleChange}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
      </ul>
    </>
  );
};
