import { useCallback } from "react";
import React from "react";

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
      onChange={useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        },
        [onChange],
      )}
    />
  );
};

export default Input;
