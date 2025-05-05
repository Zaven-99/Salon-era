import React from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";
import { DeleteCategoryState } from "../../../../hooks/services/deleteCategoryState";

import styles from "./deleteCategory.module.scss";

const DeleteDuration = ({ toggleClose }) => {
  const { category, loading, handleDelete } = DeleteCategoryState(toggleClose);  

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <h2>Удалить категорию</h2>
      {category.map((item, index) => (
        <div className={styles.category} key={index}>
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

export default DeleteDuration;
