import React from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import { DeletePositionState } from "../../../../hooks/employee/DeletePositionState";

import styles from "./deletePosition.module.scss";

const DeletePosition = ({ toggleClose }) => {
  const { position, loading, handleDelete } = DeletePositionState(toggleClose);
  if (loading) return <Spinner />;
  return (
    <div>
      <h2>Удалить должность</h2>
      {position.map((item, index) => (
        <div className={styles.position} key={index}>
          <p>{item.value}</p>
          <CustomButton
            className={styles["r-btn"]}
            label="Удалить"
            onClick={() => handleDelete(item.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default DeletePosition;
