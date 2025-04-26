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
            {newsItem.imageLink === null ? (
              ""
            ) : (
              <img
                className={styles["news-img"]}
                src={newsItem.imageLink}
                alt=""
              />
            )}
            <h2>{newsItem.name}</h2>
            <p className={styles["main-text"]}>{newsItem.mainText}</p>
            <p>{formatDate(newsItem.createdAt)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewsBlock;
