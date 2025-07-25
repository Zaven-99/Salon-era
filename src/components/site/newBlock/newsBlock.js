import React from "react";
import Spinner from "../../spinner/Spinner";
import { NewsBlockState } from "../../hooks/newsBlock/NewsBlockState";
import styles from "./newsBlock.module.scss";

const NewsBlock = () => {
  const { loading, news, formatDate } = NewsBlockState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["news-card"]}>
      {news.length > 0 && <h1>Новости</h1>}
      <ul className={styles["news-list__inner"]}>
        {news.map((newsItem, index) => (
          <li className={styles["news-item"]} key={index}>
            {newsItem.image_link === null ? (
              ""
            ) : (
              <img
                className={styles["news-img"]}
                src={newsItem.image_link}
                alt=""
              />
            )}
            <h2>{newsItem.name}</h2>
            <p className={styles["main_text"]}>{newsItem.main_text}</p>
            <p>{formatDate(newsItem.created_at)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsBlock;
