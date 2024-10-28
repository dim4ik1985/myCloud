import { IFile } from "../../../models";
import moment from "moment";
import classes from "./file.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

interface IFileProps {
  file: IFile;
  handlerDeleteFile: (id: number) => void;
}

export const File = (props: IFileProps) => {
  const { file, handlerDeleteFile } = props;
  return (
    <li className={classes["file"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["file__info"]}>
          <div className={classes["file__name"]}>{file?.name}</div>
          <div className={classes["file__size"]}>{(+file!.size! / 1024 / 1024).toFixed(2)} Mb</div>
          <div className={classes["file__date"]}>
            {moment(file?.created_at).format("MM/DD/YYYY, HH:MM:SS")}
          </div>
        </div>
        <IconButton
          onClick={() => file.id && handlerDeleteFile(file.id)}
          color={"error"}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </li>
  );
};
