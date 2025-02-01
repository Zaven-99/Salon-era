import React, { useState, useEffect } from "react";
import AOS from "aos"; // импортируем AOS
import Spinner from "../../spinner/Spinner";


import styles from "./ourWorks.module.scss";
import logo from "../../../img/logo.png";

const OurWorks = () => {
  const [activeCategory, setActiveCategory] = useState("Мужские стрижки");
  const [works, setWorks] = useState([]);
  const [groupedWorks, setGroupedWorks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const categoryMap = [
    "Мужские стрижки",
    "Женские стрижки",
    "Женские прически",
    "Окрашивание волос",
    "Маникюр",
    "Ресницы",
    "Брови",
  ];

  const getCategpryText = (category) => {
    if (category >= 1 && category <= categoryMap.length) {
      return categoryMap[category - 1];
    } else {
      return "Неизвестная позиция";
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении данных");

      const data = await response.json();
      setWorks(data);

      const grouped = data.reduce((acc, work) => {
        const category = getCategpryText(work.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(work);
        return acc;
      }, {});

      setGroupedWorks(grouped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleImageClick = (imageLink) => {
    setSelectedImage(imageLink);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
      AOS.init({
        duration: 1000,
        once: false,
        offset: 300,
      });
    }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["our-works"]}>
      <img className={styles.logo} src={logo} alt="Логотип" />
      <h1 data-aos="fade-right" className={styles["our-works__title"]}>
        Наши работы
      </h1>

      <div data-aos="fade-right" className={styles["category-container"]}>
        <div className={styles["category-buttons"]}>
          {categoryMap.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`${styles["category-button"]} ${
                activeCategory === category ? styles.active : ""
              }`}
            >
              {category}
            </div>
          ))}
        </div>

        <div className={styles["category-select"]}>
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className={styles["category-dropdown"]}
          >
            {categoryMap.map((category, index) => (
              <option
                key={index}
                value={category}
                className={
                  activeCategory === category ? styles.activeOption : ""
                }
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div data-aos="zoom-in" className={styles["works-gallery"]}>
        <h1 className={styles["category-name"]}>{activeCategory}</h1>
        {activeCategory && groupedWorks[activeCategory] ? (
          <div className={styles.wrapper}>
            {groupedWorks[activeCategory].map((work, index) => (
              <div
                key={index}
                className={styles["work-item"]}
                onClick={() => handleImageClick(work.imageLink)}
                data-aos="fade-right"
              >
                <img
                  src={work.imageLink}
                  alt={work.title}
                  className={styles["img-work"]}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Нет работ в этой категории</p>
        )}
      </div>

      {selectedImage && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModal}>
          <div
            className={styles["modal-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged"
              className={styles["modal-image"]}
            />
            <button className={styles["close-btn"]} onClick={handleCloseModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurWorks;
