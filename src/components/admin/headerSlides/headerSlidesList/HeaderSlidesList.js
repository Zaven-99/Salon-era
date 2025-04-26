import React from "react";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import ImagePreview from "../../../imagePreview/ImagePreview";
import BtnBlock from "../../../btnBlock/BtnBlock";
import { HeaderSlidesListState } from "../../../hooks/headerSlides/HeaderSlidesListState";
import styles from "./headerSlidesList.module.scss";

const HeaderSlidesList = ({ setSlides, slides, toggleOpen, toggleClose }) => {
  const {
    slidesId,
    editedSlides,
    activeInput,
    imagePreview,
    slidesToDelete,
    confirmDeleteSlides,
    loading,
    setSlidesId,
    setActiveInput,
    handleDelete,
    handleSave,
    handleEdit,
    showMessageDeleteSlide,
    closeMessageDeleteSlide,
    deletImagePreview,
    uploadImage,
    handleChange,
  } = HeaderSlidesListState(setSlides);

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
