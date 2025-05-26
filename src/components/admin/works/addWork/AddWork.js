import React from "react";
import CustomButton from "../../../customButton/CustomButton";
import ImagePreview from "../../../uploadImage/imagePreview/ImagePreview";
import Modal from "../../../modal/Modal";
import AddCategory from "../addWork/addCategory/AddCategory";
import DeleteCategory from "../addWork/deleteCategory/DeleteCategory";
import CustomSelect from "../../../customSelect/CustomSelect";
import { Controller } from "react-hook-form";
import { AddWorkState } from "../../../hooks/works/AddWorkState";
import Spinner from "../../../spinner/Spinner";

import styles from "./addWork.module.scss";
import UploadImage from "../../../uploadImage/UploadImage";

const AddWork = ({ setWorks, toggleClose, categories }) => {
  const {
    handleSubmit,
    control,
    activeInput,
    setActiveInput,
    addCategory,
    deleteCategory,
    imagePreview,
    loading,
    toggleOpenAddCategory,
    toggleCloseAddCategory,
    toggleOpenDeleteCategory,
    toggleCloseDeleteCategory,
    formSubmitHandler,
    uploadImage,
    deletImagePreview,
  } = AddWorkState(categories, setWorks, toggleClose);

  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit(formSubmitHandler)}>
      <Controller
        name="category"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field }) => (
          <CustomSelect
            {...field}
            name="category"
            control={control}
            map={categories}
            valueType="id"
            rules={{ required: "Это поле обязательно" }}
          />
        )}
      />

      <div className={styles["btn-block"]}>
        <CustomButton
          label="Добавить категорию"
          className={styles["g-btn"]}
          onClick={toggleOpenAddCategory}
          type="button"
        />
        <CustomButton
          label="Удалить категорию"
          className={styles["r-btn"]}
          onClick={toggleOpenDeleteCategory}
          type="button"
        />
      </div>
      {addCategory && (
        <Modal
          toggleOpen={toggleOpenAddCategory}
          toggleClose={toggleCloseAddCategory}
        >
          <AddCategory
            toggleClose={toggleCloseAddCategory}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </Modal>
      )}
      {deleteCategory && (
        <Modal
          toggleOpen={toggleOpenDeleteCategory}
          toggleClose={toggleCloseDeleteCategory}
        >
          <DeleteCategory toggleClose={toggleCloseDeleteCategory} />
        </Modal>
      )}

      <ImagePreview
        deletImagePreview={deletImagePreview}
        imagePreview={imagePreview}
      />

      <Controller
        name="imageLink"
        control={control}
        rules={{ required: "Это поле обязательно" }}
        render={({ field, fieldState }) => (
          <>
            {fieldState.error && (
              <p className={styles.error}>{fieldState.error.message}</p>
            )}
            <UploadImage
              onChange={(event) => {
                uploadImage(event);
                field.onChange(event);
              }}
            />
          </>
        )}
      />
      <CustomButton
        className={styles["b-btn"]}
        type="submit"
        label="Добавить работу"
      />
    </form>
  );
};

export default AddWork;
