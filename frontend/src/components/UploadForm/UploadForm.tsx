import classes from "./uploadForm.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { IUploadFormProps } from "../../models";
import { CircularProgress, TextField } from "@mui/material";
import { ModalButton } from "../ModalButton";

export const UploadForm = (props: IUploadFormProps) => {
  const {
    onChangeFile,
    onChangeComment,
    onUpload,
    isLoading,
    selectedFile,
    inputRef,
    onChooseFile,
    onRemoveFile
  } = props;

  return (
    <>
      <div className={classes["wrapper"]}>
        {/* Hidden file input element */}
        <input type="file" ref={inputRef} onChange={onChangeFile} style={{ display: "none" }} />

        {/* Button to trigger the file input dialog */}

        <button className={classes["file-btn"]} onClick={onChooseFile}>
          <FileUploadIcon /> Upload File
        </button>

        {selectedFile && (
          <div className={classes["selected-file"]}>
            <p>{selectedFile.name}</p>

            <button onClick={onRemoveFile}>
              <span>
                <DeleteIcon />
              </span>
            </button>
          </div>
        )}
      </div>
      <form
        className={classes["form-upload"]}
        encType="multipart/form-data"
        method="post"
        onSubmit={onUpload}
      >
        <TextField
          fullWidth
          id="outlined-basic"
          label="Комментарий"
          variant="outlined"
          onChange={onChangeComment}
          sx={{ marginBottom: "20px", borderRadius: "25px" }}
        />
        {isLoading ? (
          <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
        ) : (
          <ModalButton type={"submit"} label={"Загрузить"} disabled={selectedFile === null} />
        )}
      </form>
    </>
  );
};
