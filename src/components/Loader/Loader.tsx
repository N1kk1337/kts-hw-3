import React from "react";

import classNames from "classnames";

import styles from "./loader_size.module.scss";

/** Возможные значения размера лоадера */
export enum LoaderSize {
  s = "s",
  m = "m",
  l = "l",
}

/** Пропсы, которые принимает компонент Loader */
export type LoaderProps = {
  /**
   * Идет ли загрузка.
   * По умолчанию - true, для удобства использования
   * Если false, то лоадер не должен отображаться
   */
  loading?: boolean;
  /**
   * Размер лоадера.
   * По умолчанию - LoaderSize.m
   */
  size?: LoaderSize;
  className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  size = LoaderSize.m,
  ...props
}) => {
  return (
    <div
      className={classNames([styles["loader"], `size-${size}`])}
      {...props}
    />
  );
};

export default Loader;
