import React, { useEffect, useState } from "react";
import Spinner from "../../../../spinner/Spinner";
import CustomButton from "../../../../customButton/CustomButton";

import styles from "./deletePosition.module.scss";

const DeletePosition = ({ toggleClose }) => {
  const [position, setPosition] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchPosition = async () => {
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
      const filteredPositions = data.filter(
        (item) => item.category === "Должность"
      );
      setPosition(filteredPositions);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchPosition();
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
      setPosition((prevPos) => prevPos.filter((pos) => pos.id !== id));
      toggleClose();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      window.location.reload()
    }
  };

  if (loading) {
    return <Spinner />;
  }
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
