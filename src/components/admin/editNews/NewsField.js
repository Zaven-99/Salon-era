import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import ImagePreview from "../../imagePreview/ImagePreview";
import NewsList from "./newsList/NewsList";

import styles from "./newsField.module.scss";
import Spinner from "../../spinner/Spinner";

const News = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
    },
  });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addNews, setAddNews] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleOpenSignInForm = () => {
    setAddNews(true);
  };
  const toggleCloseSignInForm = () => {
    setAddNews(false);
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();
    console.log(formValues);
    formData.append(
      "clientData",
      JSON.stringify({
        id: formValues.id,
        name: formValues.name,
        mainText: formValues.mainText,
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("http://95.163.84.228:6533/news", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }

      setNews((prevNews) => [...prevNews, formData]);
      toggleCloseSignInForm();
      reset();
    } catch (error) {
    } finally {
      setLoading(false);
    }
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

  const deletImagePreview = () => {
    setImagePreview(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["news-field"]}>
      <CustomButton
        className={styles["add-news"]}
        label="Добавить новость"
        onClick={toggleOpenSignInForm}
      />

      {addNews && (
        <Modal
          toggleCloseSignInForm={toggleCloseSignInForm}
          toggleOpenSignInForm={toggleOpenSignInForm}
        >
          <h2>Добавить Услугу</h2>
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
              className={styles["accept-add__news"]}
              type="submit"
              label="Добавить новость"
            />
          </form>
        </Modal>
      )}
      <NewsList
        news={news}
        setNews={setNews}
        toggleOpenSignInForm={toggleOpenSignInForm}
        toggleCloseSignInForm={toggleCloseSignInForm}
      />
    </div>
  );
};

export default News;
