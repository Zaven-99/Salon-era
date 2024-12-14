import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../spinner/Spinner";
import CustomButton from "../../../customButton/CustomButton";
import styles from "./newsList.module.scss";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import ImagePreview from "../../../imagePreview/ImagePreview";

const NewsList = ({
  loading,
  setLoading,
  news,
  setNews,
  toggleOpenSignInForm,
  toggleCloseSignInForm,
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
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState(false);
  const [newsId, setNewsId] = useState(null);
  const [editedNews, setEditedNews] = useState({});
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://95.163.84.228:6533/news/all");

      if (!response.ok) throw new Error("Ошибка при получении новостей");
      const data = await response.json();

      setNews(data);
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchNews();
    })();
  }, []);

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
      const response = await fetch(`http://95.163.84.228:6533/news/update`, {
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
      // window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    if (newsToDelete === null) return;
    setLoading(true);

    try {
      const response = await fetch(`http://95.163.84.228:6533/news?id=${id}`, {
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

  const handleEdit = (news) => {
    setNewsId(news.id);
    setEditedNews(news);
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

  const formatDate = (date) => {
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = new Date(date).toLocaleDateString(
      "ru-RU",
      dateOptions
    );
    const formattedTime = new Date(date).toLocaleTimeString(
      "ru-RU",
      timeOptions
    );

    return `${formattedDate}, ${formattedTime}`;
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["news-list"]}>
      <h1 className={styles.news}>Новости</h1>

      <ul className={styles["news-list__inner"]}>
        {news.map((news, index) => (
          <li
            onClick={() => handleEdit(news)}
            key={index}
            className={styles["news-item"]}
          >
            {newsId === news.id ? (
              <Modal
                toggleOpenSignInForm={toggleOpenSignInForm}
                toggleCloseSignInForm={toggleCloseSignInForm}
                setEmployeeId={setNewsId}
              >
                <h2>Редактировать новость</h2>
                <>
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
                  <div className={styles["btn-block"]}>
                    <CustomButton
                      className={styles["save-news"]}
                      type="button"
                      label="Сохранить"
                      onClick={() => handleSave(news.id)}
                    />
                    <CustomButton
                      className={styles["delete-news"]}
                      type="button"
                      label="Удалить новость"
                      onClick={() => showMessageDeleteNews(news.id)}
                    />
                    <CustomButton
                      className={styles["cancel"]}
                      type="button"
                      label="Отменить"
                      onClick={() => setNewsId(null)}
                    />
                  </div>
                  {confirmDeleteNews && newsToDelete === news.id && (
                    <div className={styles["modal-overlay"]}>
                      <div className={styles["modal-content"]}>
                        <h2 className={styles["choose-question"]}>
                          Вы действительно хотите удалить новость?
                        </h2>

                        <div className={styles["btn-block"]}>
                          <CustomButton
                            className={styles["delete-news"]}
                            type="button"
                            label="Удалить новость"
                            onClick={() => handleDelete(news.id)}
                          />
                          <CustomButton
                            className={styles["cancel-delete__news"]}
                            type="button"
                            label="Отменить"
                            onClick={closeMessageDeleteNews}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </Modal>
            ) : (
              <div className={styles["news-card"]}>
                <img
                  className={styles["news-img"]}
                  src={news.imageLink}
                  alt=""
                />
                <h2>{news.name}</h2>
                <p className={styles["main-text"]}>{news.mainText}</p>
                <p>{formatDate(news.createdAt)}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
