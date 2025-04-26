import React from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import NewsList from "./newsList/NewsList";
import Spinner from "../../spinner/Spinner";
import { NewsFieldState } from "../../hooks/news/NewsFieldState";

import ImagePreview from "../../imagePreview/ImagePreview";
import styles from "./newsField.module.scss";

const News = () => {
  const {
    register,
    handleSubmit,
    errors,
    news,
    setNews,
    loading,
    addNews,
    toggleOpen,
    toggleClose,
    activeInput,
    setActiveInput,
    imagePreview,
    deletImagePreview,
    uploadImage,
    formSubmitHandler,
  } = NewsFieldState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["news-field"]}>
      <CustomButton
        className={styles["gr-btn"]}
        label="Добавить новость"
        onClick={toggleOpen}
      />

      {addNews && (
        <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
          <h2>Добавить новости</h2>
          <form
            className={styles["news-field__inner"]}
            onSubmit={handleSubmit(formSubmitHandler)}
          >
            <CustomInput
              label="Введите название новости:"
              name="name"
              type="text"
              error={errors.name}
              isActive={activeInput === "name"}
              setActiveInput={setActiveInput}
              {...register("name", {
                required: "Это поле обязательно.",
                minLength: {
                  value: 3,
                  message: "Название должен содержать минимум 3 символа.",
                },
              })}
            />

            <textarea
              name="mainText"
              type="text"
              placeholder="Описание"
              className={styles["description"]}
              {...register("mainText", {
                required: "Это поле обязательно.",
                minLength: {
                  value: 3,
                  message: "Название должен содержать минимум 3 символа.",
                },
              })}
            />
            <ImagePreview
              deletImagePreview={deletImagePreview}
              imagePreview={imagePreview}
            />

            <CustomInput
              type="file"
              name="imageLink"
              placeholder="Выберите изображение"
              isActive={activeInput === "imageLink"}
              setActiveInput={setActiveInput}
              onChange={uploadImage}
            />

            <CustomButton
              className={styles["gr-btn"]}
              type="submit"
              label="Добавить новость"
            />
          </form>
        </Modal>
      )}
      <NewsList
        news={news}
        setNews={setNews}
        toggleOpen={toggleOpen}
        toggleClose={toggleClose}
      />
    </div>
  );
};

export default News;
