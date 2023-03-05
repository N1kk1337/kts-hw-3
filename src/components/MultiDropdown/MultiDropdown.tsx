import { useState } from "react";

import classNames from "classnames";

import styles from "./MultiDropdown.module.scss";

/** Вариант для выбора в фильтре */
export type Option = {
  checked?: boolean;
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
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
    <div className={styles["multi-dropdown"]}>
      <button disabled={disabled} onClick={() => setOpen(!open)}>
        {pluralizeOptions(value) || ""}
      </button>
      {open && !disabled && (
        <div className={styles["options-container"]}>
          {open &&
            !disabled &&
            options.map((option) => (
              <div
                className={classNames({
                  option: true,
                  selected:
                    option.checked || value.some((o) => o.key === option.key),
                })}
                key={option.key}
              >
                <label>
                  {option.value}
                  <input
                    id={option.key}
                    data-key={option.key}
                    type="checkbox"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

export default MultiDropdown;
