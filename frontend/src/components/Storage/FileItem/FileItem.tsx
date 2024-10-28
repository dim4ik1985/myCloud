import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { blue, red } from "@mui/material/colors";
import { IFile } from "../../../models";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";

interface IFileItemProps {
  file: IFile;
  handlerDeleteFile: (id: number) => void;
  handlerRenameFile: (file: IFile) => void;
  handlerOpenFileLink: (id: number) => void;
}

export const FadeMenu = (props: IFileItemProps) => {
  const { file, handlerDeleteFile, handlerRenameFile, handlerOpenFileLink } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "white", backgroundColor: "#ABCDEF" }}
      >
        Действия
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button"
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          {
            <Tooltip title={"Изменить название файла"} placement={"left"}>
              <Button
                onClick={() => file && handlerRenameFile(file)}
                variant="text"
                sx={{ color: blue[500] }}
                startIcon={<EditIcon />}
              >
                Rename
              </Button>
            </Tooltip>
          }
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {
            <Tooltip title={"Открыть файл"} placement={"left"}>
              <Link
                href={`http://localhost:8000${file.file}`}
                underline="hover"
                target="_blank"
                download={file.name}
              >
                <Button startIcon={<VisibilityIcon />}>Open</Button>
              </Link>
            </Tooltip>
          }
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {
            <Tooltip title={"Получить ссылку для скачивания"} placement={"left"}>
              <Button
                onClick={() => file.id && handlerOpenFileLink(file.id)}
                variant="text"
                sx={{ color: blue[500] }}
                startIcon={<ShareIcon />}
              >
                Link
              </Button>
            </Tooltip>
          }
        </MenuItem>
        <MenuItem onClick={handleClose}>
          {
            <Tooltip title={"Удалить файл"} placement={"left"}>
              <Button
                onClick={() => file.id && handlerDeleteFile(file.id)}
                variant="text"
                sx={{ color: red[500] }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Tooltip>
          }
        </MenuItem>
      </Menu>
    </div>
  );
};
