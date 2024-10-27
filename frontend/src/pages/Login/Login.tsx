import React, { useEffect } from "react";
import { NavBar } from "../../components/NavBar";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import classes from "./login.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { errorReset, userRegisteredState } from "../../store/slices/formSlice.ts";
import { BaseForm } from "../../components/BaseForm";
import { BasicInput } from "../../components/BasicInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { IUserLoginData } from "../../models";
import { PasswordInput } from "../../components/PasswordInput";
import { isValidLogin, isValidPassword } from "../../helpers";
import { loginUser, userLoginState } from "../../store/slices/userLoginSlice.ts";
import { Navigate } from "react-router-dom";
import { ModalError } from "../../components/Modal";
import { NavItem } from "../../components/NavItem";

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const userRegistered = useAppSelector(userRegisteredState);
  const { isAuthenticated, errorLoginStatus } = useAppSelector(userLoginState);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserLoginData>({
    mode: "onChange"
  });

  useEffect(() => {
    if (userRegistered) {
      dispatch(errorReset());
    }
  }, [dispatch, userRegistered]);

  const onSubmit: SubmitHandler<IUserLoginData> = (data) => {
    dispatch(loginUser(data));
  };

  if (isAuthenticated) return <Navigate to={"/profile"} />;

  return (
    <>
      <NavBar>
        <NavItem
          name={"Home"}
          path={"/"}
          children={<HomeIcon />}
          tooltip={"Нажми чтобы вернуться на главную страницу"}
        />
        <NavItem name={"Sign up"} path={"/register"} tooltip={"Нажми чтобы зарегистрироваться"} />
      </NavBar>
      {errorLoginStatus !== "" && (
        <ModalError title={errorLoginStatus} message={"Неверный логин или пароль"} />
      )}
      <Box className={classes["wrapper"]}>
        <BaseForm
          title="Войти в аккаунт"
          message={"Вы еще не зарегистрированы? Переходите ->"}
          link={"/register"}
          handler={handleSubmit(onSubmit)}
        >
          <BasicInput
            error={errors?.login !== undefined}
            label={"Login"}
            name={"login"}
            type={"text"}
            helperText={errors.login ? "Некорректный логин" : "Введите логин"}
            register={register}
            required={true}
            validate={isValidLogin}
          />
          <PasswordInput
            error={errors?.password !== undefined}
            label={"Password"}
            name={"password"}
            type={"password"}
            helperText={errors?.password ? "Некорректный пароль" : "Введите пароль"}
            register={register}
            required={true}
            validate={isValidPassword}
          />
        </BaseForm>
      </Box>
    </>
  );
};
