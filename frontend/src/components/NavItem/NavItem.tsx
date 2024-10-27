import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface INavItemProps {
  name: string;
  path: string;
  children?: React.ReactNode;
  tooltip?: string;
}

export const NavItem = (props: INavItemProps) => {
  const { name, path, children, tooltip } = props;
  // const active = ({ isActive }: { isActive: boolean }) =>
  //   isActive ? "menu__item menu__item-active" : "menu__item";

  return (
    <Tooltip title={tooltip}>
      <Button color="inherit" component={NavLink} to={path}>
        {children}
        {name}
      </Button>
    </Tooltip>
  );
};
