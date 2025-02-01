import React, { useState, useEffect } from "react";
import Spinner from "../../spinner/Spinner";

import styles from "./newsBlock.module.scss";

const NewsBlock = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/news/all");

      if (!response.ok) throw new Error("Ошибка при получении новостей");
      const data = await response.json();

      setNews(data);
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchNews();
    })();
  }, []);

  const formatDate = (date) => {
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = new Date(date).toLocaleDateString(
      "ru-RU",
      dateOptions
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "ru-RU",
      timeOptions
    );

    return `${formattedDate}, ${formattedTime}`;
  };

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
