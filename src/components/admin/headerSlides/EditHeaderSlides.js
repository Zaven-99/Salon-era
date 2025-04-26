import React from "react";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import ImagePreview from "../../imagePreview/ImagePreview";
import HeaderSlidesList from "./headerSlidesList/HeaderSlidesList";
import Spinner from "../../spinner/Spinner";
import { EditHeaderSlidesState } from "../../hooks/headerSlides/EditHeaderSlidesState";

import styles from "./editHeaderSlides.module.scss";

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
    activeInput,
    setActiveInput,
    errorMessages,
    setSelectedFile,
    setImagePreview,
  } = EditHeaderSlidesState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["slides-field"]}>
      <CustomButton
        className={styles["gr-btn"]}
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
            <CustomInput
              type="file"
              name="imageLink"
              placeholder="Выберите изображение"
              isActive={activeInput === "imageLink"}
              setActiveInput={setActiveInput}
              accept="image/*"
              onChange={(e) => uploadImage(e, setSelectedFile, setImagePreview)}
            />
            <CustomButton
              className={styles["gr-btn"]}
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
