import React from "react";

import classNames from "classnames";
import Loader from "components/Loader";
import { LoaderSize } from "components/Loader";

import styles from "./Button.module.scss";

export type ButtonProps = React.PropsWithChildren<{
  loading?: boolean;
  className?: string;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  className,
  loading,
  ...props
}) => {
  return (
    <button
      disabled={loading || props.disabled}
      {...props}
      className={classNames(
        styles["button"],
        { button_disabled: loading || props.disabled },
        className,
      )}
    >
      {loading && <Loader size={LoaderSize.s} />}
      <div>{props.children}</div>
    </button>
  );
};

export default Button;
