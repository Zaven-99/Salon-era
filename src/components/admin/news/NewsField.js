import React from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import NewsList from "./newsList/NewsList";
import { NewsFieldState } from "../../hooks/news/NewsFieldState";
import ImagePreview from "../../uploadImage/imagePreview/ImagePreview";
import GenericSkeleton from "../../../utils/Skeleton";

import styles from "./newsField.module.scss";
import UploadImage from "../../uploadImage/UploadImage";

const News = () => {
  const {
    register,
    handleSubmit,
    errors,
    news,
    setNews,
    addNews,
    toggleOpen,
    toggleClose,
    activeInput,
    setActiveInput,
    imagePreview,
    deletImagePreview,
    uploadImage,
    formSubmitHandler,
    loading,
  } = NewsFieldState();

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

  return (
    <div className={styles["news-field"]}>
      <CustomButton
        className={styles["b-btn"]}
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

            <UploadImage onChange={uploadImage} />

            <CustomButton
              className={styles["b2-btn"]}
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
