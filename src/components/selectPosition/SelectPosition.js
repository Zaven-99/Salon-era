import React from "react";
import styles from "./selectPosition.module.scss";

const SelectPosition = React.forwardRef(({ optionsMap, name }, ref) => {
  return (
    <div>
      <select name={name} className={styles.position} ref={ref}>
        {optionsMap.map((option, index) => (
          <option key={index} value={index + 1}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectPosition;
