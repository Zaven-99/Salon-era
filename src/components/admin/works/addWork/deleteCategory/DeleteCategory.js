import React, { useEffect, useState } from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";

import styles from "./deleteCategory.module.scss";

const DeleteDuration = ({ toggleClose }) => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all", {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();
      const filteredCategory = data.filter(
        (item) => item.category === "Категория работ"
      );
      setCategory(filteredCategory);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/catalogs?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении сотрудника");
      setCategory((prevCat) => prevCat.filter((cat) => cat.id !== id));
      toggleClose();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

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
