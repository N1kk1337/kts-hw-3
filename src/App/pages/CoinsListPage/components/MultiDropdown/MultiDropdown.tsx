import React from "react";
import { useEffect, useRef, useState } from "react";

import { Option } from "config/types";

import DropdownItem from "./DropdownItem";
import styles from "./MultiDropdown.module.scss";

/** Вариант для выбора в фильтре */

export type MultiDropdownProps = {
  options: Option[];
  value: string[];
  onClose: () => void;
  onChange: (value: string[]) => void;
  disabled?: boolean;
  pluralizeOptions: (value: string[]) => string;
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  onChange,
  disabled,
  pluralizeOptions,
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current && open === false) {
      onClose();
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
              <DropdownItem
                value={value}
                key={option.key}
                option={option}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
