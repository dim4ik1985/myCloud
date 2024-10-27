import { NavBar } from "../../components/NavBar";
import { Container, IconButton, Menu, MenuItem } from "@mui/material";
import classes from "./home.module.css";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LoginIcon from "@mui/icons-material/Login";
import ArchiveIcon from "@mui/icons-material/Archive";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { NavItem } from "../../components/NavItem";
import React, { useEffect, useState } from "react";
import {
  errorProfileReset,
  profileCheckUser,
  profileState
} from "../../store/slices/profileSlice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  checkToken,
  errorUserReset,
  logoutUser,
  refreshUserToken,
  userLoginState
} from "../../store/slices/userLoginSlice.ts";
import { clearProfile } from "../../store/slices/profileSlice.ts";

export const Home = () => {
  const navItems = [
    {
      name: "Register",
      path: "/register",
      icon: <AppRegistrationIcon />,
      tooltip: "Нажми чтобы зарегистрироваться"
    },
    {
      name: "Login",
      path: "/login",
      icon: <LoginIcon />,
      tooltip: "Нажми чтобы залогиниться"
    }
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isLogin, profile } = useAppSelector(profileState);

  const { isAuthenticated, errorTokenStatus, errorTokenRefreshStatus } =
    useAppSelector(userLoginState);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearProfile());
    setAnchorEl(null);
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      dispatch(checkToken());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(profileCheckUser());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (errorTokenStatus) {
      dispatch(refreshUserToken());
      dispatch(errorProfileReset());
    }
  }, [dispatch, errorTokenStatus]);

  useEffect(() => {
    if (errorTokenRefreshStatus) {
      localStorage.clear();
      dispatch(errorUserReset());
    }
  }, [dispatch, errorTokenRefreshStatus]);

  return (
    <>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <NavBar>
            {isLogin && (
              <div>
                {profile.is_staff && (
                  <NavItem
                    name={"Admin Panel"}
                    path={"/admin"}
                    children={<AdminPanelSettingsIcon />}
                    tooltip={"Вход в административную панель"}
                  />
                )}
                <NavItem
                  name={"Storage"}
                  path={"/profile"}
                  children={<ArchiveIcon />}
                  tooltip={"Вход в хранилище"}
                />
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {profile.is_staff && (
                    <MenuItem onClick={() => navigate("/admin")}>Admin</MenuItem>
                  )}
                  <MenuItem onClick={() => navigate("/profile")}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
            {!isLogin &&
              navItems.map((item, index) => (
                <NavItem
                  key={index}
                  name={item.name}
                  path={item.path}
                  children={item.icon}
                  tooltip={item.tooltip}
                />
              ))}
          </NavBar>
        </header>
        <Container maxWidth="xl">
          {window.location.pathname === "/profile" ? (
            <h1>Profile</h1>
          ) : (
            <main>
              <div className={classes["content"]}>
                <div className={classes["about"]}>
                  <h2 className={classes["title"]}>
                    Welcome to <span>MY CLOUD</span>
                  </h2>
                </div>
              </div>
            </main>
          )}
        </Container>
      </div>
    </>
  );
};
