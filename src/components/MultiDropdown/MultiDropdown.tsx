import { useState } from 'react';
import './MultiDropdown.scss';

/** Вариант для выбора в фильтре */
export type Option = {
  checked?: boolean;
  /** Ключ варианта, используется для отправки на бек/использования в коде */
  key: string;
  /** Значение варианта, отображается пользователю */
  value: string;
};

/** Пропсы, которые принимает компонент Dropdown */
export type MultiDropdownProps = {
  /** Массив возможных вариантов для выбора */
  options: Option[];
  /** Текущие выбранные значения поля, может быть пустым */
  value: Option[];
  /** Callback, вызываемый при выборе варианта */
  onChange: (value: Option[]) => void;
  /** Заблокирован ли дропдаун */
  disabled?: boolean;
  /** Преобразовать выбранные значения в строку. Отображается в дропдауне в качестве выбранного значения */
  pluralizeOptions: (value: Option[]) => string;
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  onChange,
  disabled,
  pluralizeOptions,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [optionsState, setOptionsState] = useState<Option[]>(
    options.map((o) => {
      o.checked = false;
      return o;
    }),
  );

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.dataset.key;
    const optionByKey = options.find((option) => option.key === key) as Option;
    const optionIndexInList = value.findIndex((option) => option.key === key);
    let valueStateUpdated;
    if (optionIndexInList !== -1) {
      valueStateUpdated = value.filter((option) => option.key !== key);
    } else {
      valueStateUpdated = [...value, optionByKey];
    }

    return valueStateUpdated;
  };

  return (
    <div className="multi-dropdown">
      <button disabled={disabled} onClick={() => setOpen(!open)}>
        {pluralizeOptions(value) || ''}
      </button>
      {open && !disabled && (
        <div className="options-container">
          {open &&
            !disabled &&
            options.map((option) => (
              <div
                className={`option ${
                  option.checked || value.some((o) => o.key === option.key)
                    ? 'selected'
                    : ''
                }`}
                key={option.key}
              >
                <label>
                  {option.value}
                  <input
                    id={option.key}
                    data-key={option.key}
                    type="checkbox"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = e.target.checked;
                      const key = e.target.dataset.key;
                      const updatedOptions = options.map((o) =>
                        o.key === key ? { ...o, checked: isChecked } : o,
                      );
                      setOptionsState(updatedOptions);
                      onChange(updateValue(e));
                    }}
                  />
                </label>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
