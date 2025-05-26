import React from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import ImagePreview from "../../uploadImage/imagePreview/ImagePreview";
import HeaderSlidesList from "./headerSlidesList/HeaderSlidesList";
import Spinner from "../../spinner/Spinner";
import { EditHeaderSlidesState } from "../../hooks/headerSlides/EditHeaderSlidesState";

import styles from "./editHeaderSlides.module.scss";
import UploadImage from "../../uploadImage/UploadImage";

const EditHeaderSlides = () => {
  const {
    register,
    handleSubmit,
    slides,
    setSlides,
    addSlides,
    toggleOpen,
    toggleClose,
    imagePreview,
    deletImagePreview,
    uploadImage,
    formSubmitHandler,
    loading,
    errorMessages,
  } = EditHeaderSlidesState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["slides-field"]}>
      <CustomButton
        className={styles["b-btn"]}
        label="Добавить слайды"
        onClick={toggleOpen}
      />

      {addSlides && (
        <Modal toggleOpen={toggleOpen} toggleClose={toggleClose}>
          <h2>Добавить слайды</h2>
          <form onSubmit={handleSubmit(formSubmitHandler)}>
            <textarea
              name="name"
              type="text"
              placeholder="Описание"
              className={styles["description"]}
              {...register("name", {
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
            <p className={styles.error}>{errorMessages}</p>

            <UploadImage onChange={uploadImage} />
            <CustomButton
              className={styles["b2-btn"]}
              type="submit"
              label="Добавить слайд"
            />
          </form>
        </Modal>
      )}

      <HeaderSlidesList
        toggleOpen={toggleOpen}
        toggleClose={toggleClose}
        setSlides={setSlides}
        slides={slides}
      />
    </div>
  );
};

export default EditHeaderSlides;
