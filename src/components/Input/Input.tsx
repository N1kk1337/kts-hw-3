import classNames from 'classnames';
import './Input.scss'

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
};

export const Input: React.FC<InputProps> = ({ onChange, value, ...props }) => {
  let clNames: string = classNames(
    { input_disabled: props.disabled },
    props.className,
    'input'
  );
  return (
    <input
      {...props}
      className={clNames}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};
