import Tooltip from "@mui/material/Tooltip";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Button from "@mui/material/Button";
import { IUser } from "../../../models";
import { useNavigate } from "react-router-dom";
import "./user.css";

interface IUserProps {
  user: IUser;
  handlerRoleChange: (user: IUser) => void;
  handleDeleteUser: (id: number) => void;
}

export const User = (props: IUserProps) => {
  const { user, handlerRoleChange, handleDeleteUser } = props;
  const navigate = useNavigate();
  return (
    <li className={"wrapper"} key={user.id}>
      <div className={"header"}>
        {user.login}
        <Tooltip title={"Изменение признака администратора"} placement="top" arrow={true}>
          <span
            onClick={() => handlerRoleChange(user)}
            className={user.is_staff ? "admin on" : "admin"}
          >
            admin
          </span>
        </Tooltip>
        <Tooltip title={"Удалить пользователя"} placement="top" arrow={true}>
          <PersonRemoveIcon
            onClick={() => user.id && handleDeleteUser(user.id)}
            className={"remove"}
          />
        </Tooltip>
        {user?.files && (
          <div className={"user__info"}>
            <span>Файлов: </span>
            {user?.files.length}
          </div>
        )}
        <div className={"user__info"}>
          <span>Занято места: </span>
          {user?.files?.reduce((acc, file) => acc + file!.size! / 8 / 1024 / 1024, 0).toFixed(2) ??
            0}
          <span style={{ marginLeft: "5px" }}>mb</span>
        </div>
        <Button
          variant={"contained"}
          color={"info"}
          sx={{ marginLeft: "10px" }}
          onClick={() => navigate(`/admin/${user.id}`)}
        >
          Перейти
        </Button>
      </div>
    </li>
  );
};
