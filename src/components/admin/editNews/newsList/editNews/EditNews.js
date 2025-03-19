import React, { useState } from "react";
import CustomInput from "../../../../customInput/CustomInput";
import BtnBlock from "../../../../btnBlock/BtnBlock";
import ImagePreview from "../../../../imagePreview/ImagePreview";
import { useForm } from "react-hook-form";
import Modal from "../../../../modal/Modal";

import styles from "./editNews.module.scss";

const EditNews = ({
  editedNews,
  setLoading,
  setNews,
  setNewsId,
  setEditedNews,
  news,
  toggleOpen,
  toggleClose,
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
      imageLink: "",
    },
  });

  const [activeInput, setActiveInput] = useState("");
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDelete = async (id) => {
    if (newsToDelete === null) return;
    setLoading(true);

    try {
      const response = await fetch(`https://api.salon-era.ru/news?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Ошибка при удалении новости");
      setNews((prevNews) => prevNews.filter((newsItem) => newsItem.id !== id));
      closeMessageDeleteNews();
      document.body.style.overflow = "scroll";
    } catch (error) {
      console.error("Ошибка при удалении новости:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedNews, id };

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(`https://api.salon-era.ru/news/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setNews((prevNews) =>
        prevNews.map((mews) => (mews.id === id ? editedNews : news))
      );
      setNewsId(null);
      setEditedNews({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const closeMessageDeleteNews = () => {
    setConfirmDeleteNews(false);
    setNewsToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const showMessageDeleteNews = (id) => {
    setNewsToDelete(id);
    setConfirmDeleteNews(true);
    document.body.style.overflow = "hidden";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNews((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div>
      <CustomInput
        label="Введите Название новости:"
        type="text"
        name="name"
        error={errors.name}
        value={editedNews.name}
        handleChange={handleChange}
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
        value={editedNews.mainText}
        onChange={handleChange}
        placeholder="Описание"
        className={styles["description"]}
        name="mainText"
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

      <BtnBlock
        className1={styles["save-news"]}
        className2={styles["delete-news"]}
        className3={styles["cancel-delete__news"]}
        className4={styles["btn-block"]}
        label1="Сохранить"
        label2="Удалить новость"
        label3="Отменить"
        fnc1={() => handleSave(news.id)}
        fnc2={() => showMessageDeleteNews(news.id)}
        fnc3={() => setNewsId(null)}
        showThirdButton={true}
      />
      {confirmDeleteNews && newsToDelete === news.id && (
        <Modal
          toggleOpen={toggleOpen}
          toggleClose={toggleClose}
          setNewsId={closeMessageDeleteNews}
        >
          <h2 className={styles["choose-question"]}>
            Вы действительно хотите удалить новость?
          </h2>
          <BtnBlock
            className1={styles["delete-news"]}
            className2={styles["cancel-delete"]}
            className4={styles["btn-block"]}
            label1="Удалить новость"
            label2="Отменить"
            fnc1={() => handleDelete(news.id)}
            fnc2={closeMessageDeleteNews}
          />
        </Modal>
      )}
    </div>
  );
};

export default EditNews;
