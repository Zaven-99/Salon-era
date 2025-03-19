import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import NewsCard from "./newsCard/NewsCard";

import styles from "./newsList.module.scss";
import EditNews from "./editNews/EditNews";

const NewsList = ({ news, setNews, toggleOpen, toggleClose }) => {
  useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
      imageLink: "",
    },
  });

  const [newsId, setNewsId] = useState(null);
  const [editedNews, setEditedNews] = useState({});

  const [loading, setLoading] = useState(false);

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

  if (!news.length) {
    return <p className={styles.message}>Список новостей пуст.</p>;
  }

  const handleEdit = (news) => {
    setNewsId(news.id);
    setEditedNews(news);
  };

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
    <div className={styles["news-list"]}>
      <h1 className={styles.news}>Новости</h1>

      <ul className={styles["news-list__inner"]}>
        {news.map((news, index) => (
          <li
            onClick={() => handleEdit(news)}
            key={index}
            className={styles["news-list__item"]}
          >
            {newsId === news.id ? (
              <Modal
                toggleOpen={toggleOpen}
                toggleClose={toggleClose}
                setNewsId={setNewsId}
              >
                <h2>Редактировать</h2>

                <EditNews
                  editedNews={editedNews}
                  setLoading={setLoading}
                  setNews={setNews}
                  setNewsId={setNewsId}
                  setEditedNews={setEditedNews}
                  news={news}
                  toggleOpen={toggleOpen}
                  toggleClose={toggleClose}
                />
              </Modal>
            ) : (
              <NewsCard news={news} formatDate={formatDate} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
