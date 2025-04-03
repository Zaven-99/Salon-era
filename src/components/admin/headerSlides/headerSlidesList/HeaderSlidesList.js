import React, { useEffect, useState } from "react";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import ImagePreview from "../../../imagePreview/ImagePreview";
import BtnBlock from "../../../btnBlock/BtnBlock";

import styles from "./headerSlidesList.module.scss";

const HeaderSlidesList = ({ setSlides, slides, toggleOpen, toggleClose }) => {
  const [slidesId, setSlidesId] = useState(null);
  const [editedSlides, setEditedSlides] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [slidesToDelete, setSlidesToDelete] = useState(null);
  const [confirmDeleteSlides, setConfirmDeleteSlides] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении данных");
      const data = await response.json();

      const filteredAndSortedData = data
        .filter((slides) => slides.category === "8")
        .sort((a, b) => a.id - b.id);

      setSlides(filteredAndSortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (!slides.length) {
    return <p className={styles.message}>Список слайдов пуст.</p>;
  }

  const handleDelete = async (id) => {
    setLoading(true);
    if (slidesToDelete === null) return;
    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении работы");

      setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
      closeMessageDeleteSlide();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };
  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedSlides, id };

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
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setSlides((prevSlides) =>
        prevSlides.map((slides) => (slides.id === id ? editedSlides : slides))
      );
      setSlidesId(null);
      setEditedSlides({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const showMessageDeleteSlide = (id) => {
    setSlidesToDelete(id);
    setConfirmDeleteSlides(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteSlide = () => {
    setSlidesToDelete(null);
    setConfirmDeleteSlides(false);
    document.body.style.overflow = "scroll";
  };

  const handleEdit = (slides) => {
    setSlidesId(slides.id);
    setEditedSlides(slides);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSlides((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["slides-list"]}>
      <h1 className={styles.slides}>Слайды</h1>
      <ul className={styles["slides-list__inner"]}>
        {slides.map((slides, index) => (
          <li
            onClick={() => handleEdit(slides)}
            key={index}
            className={styles["slides-list__item"]}
          >
            {slidesId === slides.id ? (
              <>
                <Modal
                  toggleOpen={toggleOpen}
                  toggleClose={toggleClose}
                  setSlidesId={setSlidesId}
                >
                  <h2>Редактировать</h2>
                  <>
                    <textarea
                      name="name"
                      type="text"
                      placeholder="Описание"
                      value={editedSlides.name}
                      onChange={handleChange}
                      className={styles["description"]}
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
                      className1={styles["g-btn"]}
                      className2={styles["r-btn"]}
                      className3={styles["r-btn"]}
                      className4={styles["btn-block"]}
                      label1="Сохранить"
                      label2="Удалить слайд"
                      label3="Отменить"
                      fnc1={() => handleSave(slides.id)}
                      fnc2={() => showMessageDeleteSlide(slides.id)}
                      fnc3={() => setSlidesId(null)}
                      showThirdButton={true}
                    />
                  </>
                </Modal>
              </>
            ) : (
              <>
                <div>
                  <img src={slides.imageLink} alt={slides.title} />
                </div>
                <div className={styles.name}>
                  <p>{slides.name}</p>
                </div>
              </>
            )}

            {confirmDeleteSlides && slidesToDelete === slides.id && (
              <Modal
                toggleOpen={toggleOpen}
                toggleClose={toggleClose}
                setSlidesId={closeMessageDeleteSlide}
              >
                <h2 className={styles.question}>
                  Вы действительно хотите удалить слайд?
                </h2>
                <BtnBlock
                  className1={styles["g-btn"]}
                  className2={styles["r-btn"]}
                  className4={styles["btn-block"]}
                  label1="Удалить слайд"
                  label2="Отменить удаления"
                  fnc1={() => handleDelete(slides.id)}
                  fnc2={closeMessageDeleteSlide}
                />
              </Modal>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderSlidesList;
