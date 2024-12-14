import React, { useState } from "react";
import styles from "./ratingStars.module.scss";

const RatingStars = ({
  value,
  onRate,
  count,
  isInteractive = false,
  uniqueClass = "",
}) => {
  const totalStars = 5;
  const [hoveredValue, setHoveredValue] = useState(null);

  const stars = Array(totalStars)
    .fill(false)
    .map((_, index) => index < (hoveredValue !== null ? hoveredValue : value));

  const handleStarClick = (index) => {
    if (isInteractive && onRate) {
      onRate(index + 1);
    }
  };

  const handleMouseEnter = (index) => {
    if (isInteractive) {
      setHoveredValue(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoveredValue(null);
    }
  };

  return (
    <div className={`${styles.wrapper} ${uniqueClass}`}>
      <div className={styles.ratingContainer}>
        {stars.map((filled, index) => (
          <span
            key={index}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`${styles.star} ${filled ? styles.filled : ""} ${
              isInteractive ? styles.interactive : ""
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className={styles.count}>
        {count}{" "}
        {count === 1
          ? "оценка"
          : count >= 2 && count <= 4
          ? "оценки"
          : "оценок"}
      </span>
    </div>
  );
};

export default RatingStars;
