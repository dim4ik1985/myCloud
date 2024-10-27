import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classes from "./navBar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

interface INavBarProps {
  children?: React.ReactNode;
}

export const NavBar = (props: INavBarProps) => {
  const { children } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const classNavBar = location.pathname === "/" ? classes["nav"] : classes["nav-register"];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar className={classNavBar}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a onClick={() => navigate("/")} className={classes["logo"]}>
              MY CLOUD
            </a>
          </Typography>
          {children}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
