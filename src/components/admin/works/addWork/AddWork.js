import React, { useState } from "react";
import CustomInput from "../../../customInput/CustomInput";
import CustomButton from "../../../customButton/CustomButton";
import ImagePreview from "../../../imagePreview/ImagePreview";
import Modal from "../../../modal/Modal";
import AddCategory from "../addWork/addCategory/AddCategory";
import DeleteCategory from "../addWork/deleteCategory/DeleteCategory";
import CustomSelect from "../../../customSelect/CustomSelect";
import { Controller, useForm } from "react-hook-form";

import styles from "./addWork.module.scss";
import Spinner from "../../../spinner/Spinner";

const AddWork = ({ setWorks, toggleClose, categoryOptions }) => {
  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "",
    },
  });

  const [activeInput, setActiveInput] = useState("");
  const [addCategory, setAddCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleOpenAddCategory = () => {
    setAddCategory(true);
  };
  const toggleCloseAddCategory = () => {
    setAddCategory(false);
  };
  const toggleOpenDeleteCategory = () => {
    setDeleteCategory(true);
  };
  const toggleCloseDeleteCategory = () => {
    setDeleteCategory(false);
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          name: formValues.workName,
          category: formValues.category,
        },
      ])
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.statusText}`);
      }

      setWorks((prevWorks) => [...prevWorks, formData]);
      toggleClose();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const deletImagePreview = () => {
    setImagePreview(null);
  };

  const uploadImage = (event) => {
    const files = event?.target?.files;
    if (!files || files.length === 0) {
      console.error("Файлы не найдены или пусты");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Выберите файл изображения.");
    }
  };

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
            map={categoryOptions}
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
            <CustomInput
              type="file"
              name="imageLink"
              placeholder="Выберите изображение"
              isActive={activeInput === "imageLink"}
              setActiveInput={setActiveInput}
              onChange={(e) => {
                uploadImage(e);
                field.onChange(e);
              }}
              rules={{ required: "Это поле обязательно" }}
            />
          </>
        )}
      />
      <CustomButton
        className={styles["gr-btn"]}
        type="submit"
        label="Добавить работу"
      />
    </form>
  );
};

export default AddWork;
