import React from "react";

import classNames from "classnames";
import { Option } from "models/types";

import styles from "./MultiDropdown.module.scss";

type DropdownItemProp = {
  option: Option;
  value: string[];
  onChange: (val: string[]) => void;
};

export const DropdownItem: React.FC<DropdownItemProp> = ({
  option,
  onChange,
  value,
}) => {
  const updatedValues = (option: string): string[] => {
    let newVal = [...value];
    if (value.indexOf(option) > -1) {
      newVal.splice(newVal.indexOf(option), 1);
    } else {
      newVal = [...newVal, option];
    }
    return newVal;
  };

  return (
    <div
      className={classNames(
        styles.option,
        value.includes(option.key) && styles.selected,
      )}
    >
      <label>
        {option.value}
        <input
          id={option.key}
          data-key={option.key}
          type="checkbox"
          onChange={() => onChange(updatedValues(option.key))}
        />
      </label>
    </div>
  );
};

export default DropdownItem;
