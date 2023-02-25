import './CheckBox.scss';
/** Пропсы, которые принимает компонент CheckBox */
export type CheckBoxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  /** Вызывается при клике на чекбокс */
  onChange: (value: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({
  disabled,
  checked,
  onChange,
  ...props
}) => {
  return (
   <input
    className="checkbox"
    type="checkbox"
    disabled={disabled}
    checked={checked}
    onChange={(event) => onChange(event.target.checked)}
    {...props}
  >

  </input>
  );
};
