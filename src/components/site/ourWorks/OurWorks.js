import React, { useState, useEffect } from "react";
import AOS from "aos"; // импортируем AOS
import Spinner from "../../spinner/Spinner";

import styles from "./ourWorks.module.scss";
import logo from "../../../img/logo.png";

const OurWorks = () => {
  const [activeCategory, setActiveCategory] = useState(""); // Состояние для выбранной категории
  const [works, setWorks] = useState([]);
  const [groupedWorks, setGroupedWorks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");

      if (!response.ok)
        throw new Error("Ошибка при получении данных категорий");

      const data = await response.json();
      // Create a map for category ids to their names
      const categoryObj = data.reduce((acc, category) => {
        acc[category.id] = category.value;
        return acc;
      }, {});

      setCategoryMap(categoryObj); // Set category map
      setCategories(data); // Save the categories list
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch works
  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении данных");

      const data = await response.json();
      setWorks(data);

      // Group works by category names using category map
      const grouped = data.reduce((acc, work) => {
        const categoryId = work.category; // Category ID from the work
        const categoryName = categoryMap[categoryId]; // Get category name from map

        if (categoryName) {
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(work);
        }
        return acc;
      }, {});

      setGroupedWorks(grouped);

      // Set the first category as active if available
      const uniqueCategories = Object.keys(grouped);
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories and works once on mount
  useEffect(() => {
    fetchCategories(); // Fetch categories on mount
  }, []);

  // Once categories are loaded, fetch the works
  useEffect(() => {
    if (Object.keys(categoryMap).length > 0) {
      fetchWorks(); // Fetch works once category map is ready
    }
  }, [categoryMap]); // This will trigger once categoryMap is populated

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
          {Object.keys(groupedWorks).map((category, index) => (
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
            {Object.keys(groupedWorks).map((category, index) => (
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
        <h1 className={styles["category-name"]}>
          {activeCategory ? activeCategory : "Выберите категорию"}
        </h1>
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
