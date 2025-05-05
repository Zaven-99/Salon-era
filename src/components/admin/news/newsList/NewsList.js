import React from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../modal/Modal";
import NewsCard from "./newsCard/NewsCard";
import { NewsListState } from "../../../hooks/news/NewsListState";
import EditNews from "./editNews/EditNews";
import GenericSkeleton from "../../../../utils/Skeleton";

import styles from "./newsList.module.scss";

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

  if (loading) {
    return (
      <GenericSkeleton
        headerCount={1}
        headerWidths={["50%", "30%"]}
        itemCount={10}
        itemWidth="100%"
        itemHeight={50}
      />
    );
  }

  if (!news.length) {
    return <p className={styles.message}>Список новостей пуст.</p>;
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
