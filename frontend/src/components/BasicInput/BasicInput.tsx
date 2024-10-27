import { TextField } from "@mui/material";
import { IUserRegisterData, IFormInputProps, IUserLoginData } from "../../models";
import { UseFormRegister } from "react-hook-form";

export const BasicInput = (props: IFormInputProps) => {
  const { label, type, name, helperText, register, required, validate, error } = props;

  return (
    <TextField
      fullWidth
      error={error}
      helperText={helperText}
      id={name}
      label={label}
      type={type}
      variant="outlined"
      margin={"normal"}
      autoComplete="off"
      {...(register as UseFormRegister<IUserRegisterData | IUserLoginData>)(name, {
        required: required,

        validate: (value) => {
          return validate?.(value);
        }
      })}
    />
  );
};
