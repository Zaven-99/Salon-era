import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import ImagePreview from "../../imagePreview/ImagePreview";
import HeaderSlidesList from "./headerSlidesList/HeaderSlidesList";
import Spinner from "../../spinner/Spinner";

import styles from "./headerSlides.module.scss";

const EditHeaderSlides = () => {
  const { handleSubmit, reset, register } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
    },
  });

  const [slides, setSlides] = useState([]);
  const [addSlides, setAddSlides] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const toggleOpen = () => {
    setAddSlides(true);
  };
  const toggleClose= () => {
    setAddSlides(false);
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

  const formSubmitHandler = async (formValues) => {
    setLoading(true);

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([{
        name: formValues.name,
        category: "8",
      }])
    );
    if (!selectedFile) {
      setErrorMessages("Добавьте картинку!");
      setLoading(false);
      return;
    }

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

      setSlides((prevSlides) => [...prevSlides, formData]);
      toggleClose();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
    }
  };
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
              onChange={uploadImage}
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
