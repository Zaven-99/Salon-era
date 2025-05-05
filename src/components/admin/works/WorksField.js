import React from "react";
import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import WorkList from "./workList/WorkList";
import { WorksFieldState } from "../../hooks/works/WorksFieldState";
import AddWork from "./addWork/AddWork";

import styles from "./worksField.module.scss";

const OurWorks = () => {
  const {
    works,
    setWorks,
    addWorks,
    categories,
    getCategoryText,
    toggleOpen,
    toggleClose,
  } = WorksFieldState();

  return (
    <div className={styles["works-filed"]}>
      <CustomButton
        className={styles["b-btn"]}
        label="Добавить работу"
        onClick={toggleOpen}
      />

      {addWorks && (
        <Modal toggleOpen={toggleOpen} toggleClose={toggleClose}>
          <h2>Добавить работу</h2>
          <AddWork
            setWorks={setWorks}
            toggleClose={toggleClose}
            categories={categories}
            getCategoryText={getCategoryText}
          />
        </Modal>
      )}

      <WorkList
        toggleClose={toggleClose}
        toggleOpen={toggleOpen}
        setWorks={setWorks}
        works={works}
        categories={categories}
        getCategoryText={getCategoryText}
      />
    </div>
  );
};

export default OurWorks;
