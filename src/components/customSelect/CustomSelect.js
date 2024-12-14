import React from "react";

import styles from './customSelect.module.scss'

const CustomSelect = ({ edited, handleChange , map, name, register}) => {
  return (
    <select
      name={name}
      className={styles["custom-select__style"]}
      value={edited && (edited || "")}
      onChange={handleChange && handleChange}
      {...register(name, { required: "Это поле обязательно" })}
    >
      {map.map((map, index) => (
        <option key={index} value={index + 1}>
          {map}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
