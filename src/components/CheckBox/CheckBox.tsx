import styles from "./CheckBox.module.scss";

/** Пропсы, которые принимает компонент CheckBox */
export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (value: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({ onChange, ...props }) => {
  return (
    <input
      className={styles["checkbox"]}
      onChange={(event) => onChange(event.target.checked)}
      {...props}
    ></input>
  );
};

export default CheckBox;
