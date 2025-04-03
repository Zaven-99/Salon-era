import React from "react";
import { useController } from "react-hook-form";
import styles from "./customSelect.module.scss";

const CustomSelect = React.forwardRef(
  (
    { name, control, map, rules, handleChange, edited, valueType = "index" },
    ref
  ) => {
    const { field, fieldState } = useController({
      control,
      name,
      rules,
    });

    const selectValue = edited ?? field.value;

    return (
      <div>
        {fieldState?.error && (
          <p className={styles.error}>{fieldState?.error.message}</p>
        )}
        <select
          {...field}
          onChange={handleChange ? handleChange : field.onChange}
          value={selectValue}
          ref={ref}
          className={styles["custom-select__style"]}
        >
          {map && map.length > 0 && map[0].category === "Продолжительность" && (
            <option value="">Выберите продолжительность</option>
          )}
          {map && map.length > 0 && map[0].category === "Категория услуг" && (
            <option value="">Выберите категорию</option>
          )}
          {map && map.length > 0 && map[0].category === "Должность" && (
            <option value="">Выберите должность</option>
          )}
          {map && map.length > 0 && map[0].category === "Категория работ" && (
            <option value="">Выберите работу</option>
          )}

          {map?.map((item, index) => (
            <option
              key={index}
              value={
                valueType === "item"
                  ? item
                  : valueType === "id"
                  ? item.id
                  : index
              }
            >
              {!isNaN(item) ? parseInt(item) : item.value}
              {typeof item === "string" ? item : ""}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export default CustomSelect;

//  {
//    map?.map((item, index) => (
//      <option key={index} value={valueType === "item" ? item : index + 1}>
//        {item}
//      </option>
//    ));
//  }

// {!isNaN(item.value) ? getText(parseInt(item.value)) : item.value}
