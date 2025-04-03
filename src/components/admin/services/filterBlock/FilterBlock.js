import React from "react";

import styles from "./filterBlock.module.scss";

const FilterBlock = ({
  selectedCategory,
  setSelectedCategory,
  uniqueCategories,
  getCategoryTextById,
}) => {
  return (
    <div className={styles["filter-block"]}>
      <p className={styles["filter-title"]}>Отфильтруйте по категориям</p>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className={styles.filter}
      >
        <option value="">Все категории</option>
        {uniqueCategories.map((category) => (
          <option key={category} value={category}>
            {getCategoryTextById(category)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBlock;
