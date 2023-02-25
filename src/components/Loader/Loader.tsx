import React from 'react';
import './loader_size.css';

/** Возможные значения размера лоадера */
export enum LoaderSize {
  s = 's',
  m = 'm',
  l = 'l',
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
  loading = true,
  size = LoaderSize.m,
  ...props
}) => {
  if (loading) return <div className={'loader_size-' + size} {...props} />;
  return null;
};
