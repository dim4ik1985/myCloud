import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface ITooltipProps {
  title: string;
  children?: React.ReactNode;
}

export const BasicTooltip = (props: ITooltipProps) => {
  const { title, children } = props;
  return <Tooltip title={title}>{React.isValidElement(children) ? children : <></>}</Tooltip>;
};
