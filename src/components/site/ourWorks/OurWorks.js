import React from "react";
import Spinner from "../../spinner/Spinner";
import { OurWorksState } from "../../hooks/ourWorks/OurWorksState";
import styles from "./ourWorks.module.scss";
import logo from "../../../img/logo.png";

const OurWorks = () => {
  const {
    activeCategory,
    groupedWorks,
    loading,
    selectedImage,
    handleCategoryClick,
    handleImageClick,
    handleCloseModal,
  } = OurWorksState();

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
                onClick={() => handleImageClick(work.image_link)}
                data-aos="fade-right"
              >
                <img
                  src={work.image_link}
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
