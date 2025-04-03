import React, { useState, useEffect } from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import WorkList from "./workList/WorkList";
import Spinner from "../../spinner/Spinner";

import styles from "./worksField.module.scss";
import AddWork from "./addWork/AddWork";

const OurWorks = () => {
  const [works, setWorks] = useState([]);
  const [addWorks, setAddWorks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  console.log(categories.find((cat) => cat.value));
  
  const getCategoryText = (categoryId) => {
    const category = categories.find((cat) => cat.value === categoryId);
  
    return category ? category.value : "Неизвестная работа"; // Если категория найдена, выводим её значение, иначе текст по умолчанию
  };
  

  const categoryOptions = categories.filter(
    (item) => item.category === "Категория работ"
  );

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");

      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();

      setCategories(data);
      
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const toggleOpen = () => {
    setAddWorks(true);
  };
  const toggleClose = () => {
    setAddWorks(false);
  };

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
            categoryOptions={categoryOptions}
            getCategoryText={getCategoryText}
          />
        </Modal>
      )}

      <WorkList
        toggleClose={toggleClose}
        toggleOpen={toggleOpen}
        setWorks={setWorks}
        works={works}
        categoryOptions={categoryOptions}
        getCategoryText={getCategoryText}
      />
    </div>
  );
};

export default OurWorks;
