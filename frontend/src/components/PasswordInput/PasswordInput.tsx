import { IFormInputProps } from "../../models";
import React from "react";
import classes from "./passwordInput.module.css";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BasicInput } from "../BasicInput";
import { IconButton } from "@mui/material";

export const PasswordInput = (props: IFormInputProps) => {
  const { label, type, name, helperText, register, required, validate, error } = props;

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <>
      <div className={classes["password"]}>
        <BasicInput
          name={name}
          register={register}
          label={label}
          type={showPassword ? "text" : type}
          helperText={helperText}
          required={required}
          validate={validate}
          error={error}
        />
        <IconButton
          className={classes["icon"]}
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          onMouseUp={handleMouseUpPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
    </>
  );
};
