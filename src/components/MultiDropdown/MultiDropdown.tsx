import { useEffect, useRef, useState } from "react";

import classNames from "classnames";

import styles from "./MultiDropdown.module.scss";

/** Вариант для выбора в фильтре */
export type Option = {
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
}) => {
  const [open, setOpen] = useState(false);
  const isMounted = useRef(false);

  const updatedValues = (key: string): Option[] => {
    const option = options.find((option) => option.key === key);
    if (option) {
      const index = value.findIndex((val) => val.key === option.key);
      if (index >= 0) {
        return value.filter((val) => val.key !== option.key);
      } else {
        return [...value, option];
      }
    }
    return value;
  };

  useEffect(() => {
    if (isMounted.current && open === false) {
    } else {
      isMounted.current = true;
    }
  }, [open]);

  return (
    <div className={styles["multi-dropdown"]}>
      <button disabled={disabled} onClick={() => setOpen(!open)}>
        {open ? (
          <span>Press here to filter</span>
        ) : (
          pluralizeOptions(value) || ""
        )}
      </button>
      {open && !disabled && (
        <div className={styles["scroll-container"]}>
          <div className={styles["options-container"]}>
            {options.map((option) => (
              <div
                className={classNames(
                  styles.option,
                  value.some((o) => o.key === option.key) && styles.selected,
                )}
                key={option.key}
              >
                <label>
                  {option.value}
                  <input
                    id={option.key}
                    data-key={option.key}
                    type="checkbox"
                    onChange={() => {
                      onChange(updatedValues(option.key));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
