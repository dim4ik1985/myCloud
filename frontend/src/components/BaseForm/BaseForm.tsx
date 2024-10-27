import classes from "./baseForm.module.css";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { FormButton } from "../FormButton";
import { useAppSelector } from "../../hooks";
import { isLoadingState } from "../../store/slices/formSlice.ts";
import { CircularProgress } from "@mui/material";
import { IBaseFormProps } from "../../models";
import { userLoginState } from "../../store/slices/userLoginSlice.ts";

export const BaseForm = (props: IBaseFormProps) => {
  const { title, children, message, link, handler } = props;
  const navigate = useNavigate();
  const isLoading = useAppSelector(isLoadingState);
  const { isUserLoading } = useAppSelector(userLoginState);

  return (
    <Box className={classes["wrapper"]}>
      <Box className={classes["formBox"]}>
        <Box className={classes["itemBox"]}>{title}</Box>
        <form onSubmit={handler}>
          {children}
          {isLoading || isUserLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormButton />
          )}
        </form>
      </Box>

      <Box className={classes["itemBox"]}>
        <div className={classes["link"]} onClick={() => navigate(link)}>
          {message}
        </div>
      </Box>
    </Box>
  );
};
