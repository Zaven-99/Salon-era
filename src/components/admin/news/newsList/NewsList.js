import React from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import NewsCard from "./newsCard/NewsCard";
import { NewsListState } from "../../../hooks/news/NewsListState";

import styles from "./newsList.module.scss";
import EditNews from "./editNews/EditNews";

const NewsList = ({ news, setNews, toggleOpen, toggleClose }) => {
  const {
    newsId,
    setNewsId,
    editedNews,
    setEditedNews,
    loading,
    setLoading,
    handleEdit,
    formatDate,
  } = NewsListState(setNews);  

  useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
      imageLink: "",
    },
  });

  if (!news.length) {
    return <p className={styles.message}>Список новостей пуст.</p>;
  }

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
