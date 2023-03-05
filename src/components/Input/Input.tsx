import classNames from "classnames";

import styles from "./Input.module.scss";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export const Input: React.FC<InputProps> = ({ onChange, value, ...props }) => {
  return (
    <input
      {...props}
      className={classNames(
        { input_disabled: props.disabled },
        props.className,
        styles["input"],
      )}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};

export default Input;
