// **Требования:**
// 1. Кнопка использует html-тег button и принимает все его пропсы
// 1. Кнопка принимает пропсы ButtonProps и удовлетворяет их требованиям, описанным ниже
// 1. Текст кнопки/дочерний элемент передается в качестве children
// 1. При передаче дополнительного className не должны сбрасываться внутренние (описанные вами в стилях) классы кнопки
// 1. Компонент должен быть реактивным, то есть реагировать на изменение любых пропсов
// 1. css-классы должны быть названы согласно [Методологии БЭМ](https://ru.bem.info/methodology/quick-start/):
//     * Базовый класс кнопки: `.button`
//     * Класс-модификатор заблокированной кнопки:  `.button_disabled`
// 1. Для управления классами необходимо использовать библиотеку classnames

import classNames from 'classnames';
import { Loader, LoaderSize } from '../Loader/Loader';
import './Button.scss';

/** Пропсы, который принимает компонент Button */
export type ButtonProps = React.PropsWithChildren<{
  /**
   * Если true, то внутри кнопки вместе с children отображается компонент Loader
   * Также кнопка должна переходить в состояние disabled
   */
  loading?: boolean;
  className?: string;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  className,
  loading,
  ...props
}) => {
  let clNames: string = classNames(
    'button',
    { button_disabled: loading || props.disabled },
    className,
  );

  return (
    <button disabled={loading} {...props} className={clNames}>
      {loading && <Loader size={LoaderSize.s} />}
      <div>{props.children}</div>
    </button>
  );
};
