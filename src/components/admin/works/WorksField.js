import React from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import WorkList from "./workList/WorkList";
import Spinner from "../../spinner/Spinner";
import { WorksFieldState } from "../../hooks/works/WorksFieldState";
import styles from "./worksField.module.scss";
import AddWork from "./addWork/AddWork";

const OurWorks = () => {
  const {
    works,
    setWorks,
    addWorks,
    loading,
    categories,
    getCategoryText,
    toggleOpen,
    toggleClose,
  } = WorksFieldState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["works-filed"]}>
      <CustomButton
        className={styles["gr-btn"]}
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
