import classes from "./modalButton.module.css";

interface IModalButtonProps {
  disabled?: boolean;
  label?: string;
  type?: "submit" | "button";
}

export const ModalButton = (props: IModalButtonProps) => {
  const { disabled, label, type } = props;

  return (
    <button type={type} className={classes["file-btn"]} disabled={disabled}>
      {label}
    </button>
  );
};
