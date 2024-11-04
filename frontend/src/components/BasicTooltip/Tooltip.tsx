import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface ITooltipProps {
  title: string;
  children?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

export const BasicTooltip = (props: ITooltipProps) => {
  const { title, children, placement } = props;
  return (
    <Tooltip title={title} placement={placement}>
      {React.isValidElement(children) ? children : <></>}
    </Tooltip>
  );
};
