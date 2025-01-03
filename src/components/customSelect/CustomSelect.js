import React from "react";
import { useController } from "react-hook-form";
import styles from "./customSelect.module.scss";

const CustomSelect = React.forwardRef(
  ({ name, control, map, rules, handleChange, edited }, ref) => {
    const { field, fieldState } = useController({
      control,
      name,
      rules,
    });

    const selectValue = edited ?? field.value;

    return (
      <div>
        <select
          {...field}
          onChange={handleChange ? handleChange : field.onChange}
          value={selectValue}
          ref={ref}
          className={styles["custom-select__style"]}
        >
          {map.map((item, index) => (
            <option key={index} value={index + 1}>
              {item}
            </option>
          ))}
        </select>
        {fieldState?.error && (
          <p className={styles.error}>{fieldState?.error.message}</p>
        )}
      </div>
    );
  }
);

export default CustomSelect;
