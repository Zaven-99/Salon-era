import React from "react";
import styles from "./selectCategory.module.scss";

const SelectCategory = React.forwardRef(
  ({ optionsMap, name, value, onChange }, ref) => {
    return (
      <div>
        <select
          name={name}
          className={styles["custom-select__style"]}
          ref={ref}
          value={value}
          onChange={onChange}
        >
          <option value="">Выберите категорию</option>
          {optionsMap.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default SelectCategory;
