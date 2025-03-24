import React from "react";

import styles from "./newsCard.module.scss";

const NewsCard = ({ news, formatDate }) => {
  return (
    <div className={styles["news-card"]}>
      {news.imageLink === null ? (
        ""
      ) : (
        <img className={styles["news-img"]} src={news.imageLink} alt="" />
      )}

      <h2>{news.name}</h2>
      <p className={styles["main-text"]}>{news.mainText}</p>
      <p>{formatDate(news.createdAt)}</p>
    </div>
  );
};

export default NewsCard;
