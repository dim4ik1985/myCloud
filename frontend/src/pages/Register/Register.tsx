import React from "react";
import classes from "./register.module.css";
import { NavBar } from "../../components/NavBar";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import { BaseForm } from "../../components/BaseForm";
import { BasicInput } from "../../components/BasicInput";
import {
  errorState,
  fetchFormData,
  userRegisteredState,
  passwordState,
  errorPass
} from "../../store/slices/formSlice.ts";
import { useForm, SubmitHandler } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { IUserRegisterData } from "../../models";
import { isValidEmail, isValidLogin, isValidPassword } from "../../helpers";
import { PasswordInput } from "../../components/PasswordInput";
import { ModalError } from "../../components/Modal";
import { NavItem } from "../../components/NavItem";

export const Register: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserRegisterData>({
    mode: "onChange"
  });

  const loginError = errors.login;
  const emailError = errors.email;
  const passwordError = errors.password1;

  const errorStatus = useAppSelector(errorState);
  const errorPassword = useAppSelector(passwordState);
  const userRegistered = useAppSelector(userRegisteredState);

  const onSubmit: SubmitHandler<IUserRegisterData> = (data) => {
    if (data.password1 !== data.password2) {
      return dispatch(errorPass());
    }
    dispatch(fetchFormData(data));
  };

  if (userRegistered) return <Navigate to={"/login"} />;

  return (
    <>
      <NavBar>
        <NavItem
          name={"Home"}
          path={"/"}
          children={<HomeIcon />}
          tooltip={"Нажми чтобы вернуться на главную страницу"}
        />
        <NavItem name={"Sing in"} path={"/login"} tooltip={"Нажми чтобы залогиниться"} />
      </NavBar>
      {errorStatus !== "" && <ModalError title={errorStatus} message={"Логин уже занят"} />}
      {errorPassword !== "" && <ModalError title={errorPassword} message={""} />}
      <Box className={classes["wrapper"]}>
        <BaseForm
          title="Регистрация"
          message={"Уже есть аккаунт? Переходите ->"}
          link={"/login"}
          handler={handleSubmit(onSubmit)}
        >
          <BasicInput
            error={!!loginError}
            label={"Login"}
            name={"login"}
            type={"text"}
            helperText={
              loginError
                ? "Только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов"
                : "Введите логин"
            }
            register={register}
            required={true}
            validate={isValidLogin}
          />
          <BasicInput
            label={"Name"}
            name={"username"}
            type={"text"}
            helperText={"Напишите ваше имя"}
            register={register}
            required={false}
          />
          <BasicInput
            error={!!emailError}
            label={"Email"}
            name={"email"}
            type={"email"}
            helperText={emailError ? "Укажите корректный email" : "Введите email"}
            register={register}
            required={true}
            validate={isValidEmail}
          />
          <PasswordInput
            error={!!passwordError}
            label={"Password"}
            name={"password1"}
            type={"password"}
            helperText={
              passwordError
                ? "Пароль должен содержать не менее 6 символов, как минимум одна заглавная буква, одна цифра и один специальный символ"
                : "Введите пароль"
            }
            register={register}
            required={true}
            validate={isValidPassword}
          />
          <PasswordInput
            label={"Password"}
            name={"password2"}
            type={"password"}
            helperText={"Введите пароль еще раз"}
            register={register}
            required={true}
          />
        </BaseForm>
      </Box>
    </>
  );
};
