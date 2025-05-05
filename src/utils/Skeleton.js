import React from "react";
import styles from "./skeleton.module.scss";

const GenericSkeleton = ({
  headerCount = 0,
  itemCount = 5,
  headerWidths = [],
  itemWidth = "80%",
  itemHeight = 40,
}) => {
  return (
    <div className={styles["section-skeleton"]}>
      {/* Заголовки */}
      {headerCount > 0 && (
        <div className={styles.header}>
          {Array.from({ length: headerCount }).map((_, i) => (
            <div key={i} className={styles.wrapper}>
              <div
                className={styles["header-skeleton"]}
                style={{ width: headerWidths[i] || "60%", height: 40 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Элементы списка */}
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className={styles.wrapper}>
          <div
            className={styles["item-skeleton"]}
            style={{ width: itemWidth, height: itemHeight }}
          />
        </div>
      ))}
    </div>
  );
};

export default GenericSkeleton;
