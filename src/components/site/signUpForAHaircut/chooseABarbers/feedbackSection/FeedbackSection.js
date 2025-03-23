import React, { useState } from "react";
import CustomButton from "../../../../customButton/CustomButton";
import { useAuth } from "../../../../../use-auth/use-auth";
import { useSelector } from "react-redux";
import BtnBlock from "../../../../btnBlock/BtnBlock";

import styles from "./feedBackSection.module.scss";

const FeedbackSection = ({
  feedbackBarber,
  feedbackText,
  ratings,
  setFeedbackText,
  setLoading,
  setFeedbacks,
  feedbacks,
  setRatings,
  selectedBarber,
  handleGetFeedback,
  showFeedBackToggle,
  item,
  RatingStars,
  avatar,
}) => {
  const [editedFeedbackText, setEditedFeedbackText] = useState({});
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [feedbackLimit, setFeedbackLimit] = useState(5);
  const [initialHeight, setInitialHeight] = useState("25px");

  const [height, setHeight] = useState(initialHeight);

  const { id: clientId } = useAuth();
  const user = useSelector((state) => state.user);

  const handleEdit = (feedBack) => {
    setEditFeedbackId(feedBack.id);

    setEditedFeedbackText(feedBack);

    setHeight(initialHeight);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/feedbacks?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении отзыва");
      }

      setFeedbacks((prevFeedback) =>
        prevFeedback.filter((feedback) => feedback.id !== id)
      );
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    setLoading(true);

    const feedbackToUpdate = { ...editedFeedbackText, id };

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...feedbackToUpdate,
        createdAt: formattedDateTimeForServer(),
      })
    );
    try {
      const response = await fetch(
        `https://api.salon-era.ru/feedbacks/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Ошибка при сохранении услуги");

      setFeedbacks((prevFeedback) =>
        prevFeedback.map((feedback) =>
          feedback.id === id ? editedFeedbackText : feedback
        )
      );
      setEditFeedbackId(null);
      setEditedFeedbackText({});
      setInitialHeight(height);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const newText = e.target.value;

    setEditedFeedbackText({
      ...editedFeedbackText,
      text: newText,
    });

    const textarea = e.target;

    const textHeight = textarea.scrollHeight;

    const maxHeight = 250;

    const finalHeight = textHeight > maxHeight ? maxHeight : textHeight;

    setHeight(`${finalHeight}px`);
  };

  const getBarberFeedbacks = (barberId) => {
    return feedbacks.filter((feedback) => feedback.id_client_to === barberId);
  };

  const loadMoreFeedbacks = () => {
    setFeedbackLimit((prevLimit) => prevLimit + 5);
  };

  const handleRate = (barberId, newRating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [barberId]: newRating,
    }));
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

  const formattedDateTimeForServer = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0"); // Получаем секунды
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0"); // Получаем миллисекунды

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const handleFeedbackChange = (e) => {
    setFeedbackText(e.target.value);
    const newText = e.target.value;

    setEditedFeedbackText(newText);

    const textarea = e.target;

    const textHeight = textarea.scrollHeight;

    const maxHeight = 250;

    const finalHeight = textHeight > maxHeight ? maxHeight : textHeight;

    setHeight(`${finalHeight}px`);
  };

  const isFeedbackDisabled =
    !feedbackText.trim() || ratings[selectedBarber?.id] === 0;

  const handleSubmitFeedback = async () => {
    setLoading(true);

    const formData = new FormData();
    const clientFirstName = user.firstName;
    const clientLastName = user.lastName;

    formData.append(
      "clientData",
      JSON.stringify({
        firstName: clientFirstName,
        lastName: clientLastName,
        id_client_from: clientId,
        id_client_to: selectedBarber.id,
        text: feedbackText,
        value: ratings[selectedBarber.id],
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/feedbacks`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке");
      }

      setFeedbackText("");
      setRatings((prevRatings) => ({
        ...prevRatings,
        [selectedBarber.id]: 0,
      }));
      handleGetFeedback();
    } catch (error) {
      alert(`Произошла ошибка при отправке данных.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {feedbackBarber && feedbackBarber.id === item.id && (
        <div
          className={`${styles.feedBack} ${
            feedbackBarber ? styles.open : "сlose"
          }`}
        >
          <h3>Отзывы:</h3>
          <div className={styles["feedback-list"]}>
            {feedbacks.length === 0 && (
              <p className={styles["feedback-title"]}>
                Оцените работу мастера!
              </p>
            )}
            {getBarberFeedbacks(item.id)
              .slice(0, feedbackLimit)
              .map((feedback) => (
                <div key={feedback.id} className={styles.feedbackItem}>
                  <div className={styles["user-feedback__block"]}>
                    <div>
                      <img
                        className={styles["user-avatar"]}
                        src={user.imageLink || avatar}
                        alt=""
                      />
                    </div>
                    <div className={styles["user-feedback__block__inner"]}>
                      <p className={styles["user-feedback__firstName"]}>
                        {feedback.id_client_from === clientId
                          ? "Вы"
                          : `${feedback.firstName} ${feedback.lastName}`}
                      </p>

                      <div className={styles["feedBack-block"]}>
                        <div className={styles["user-feedback__text"]}>
                          {feedback.id === editFeedbackId ? (
                            <textarea
                              className={styles["edit-feedback"]}
                              value={editedFeedbackText.text}
                              onChange={handleChange}
                              style={{ height }}
                            />
                          ) : (
                            <div className={styles["feedback-text"]}>
                              {feedbacks.length > 0 ? (
                                <p>{feedback.text}</p>
                              ) : (
                                "оставьте отзыв"
                              )}
                              <p>{formatDate(feedback.createdAt)}</p>
                            </div>
                          )}
                        </div>
                        {feedback.id === editFeedbackId ? (
                          <BtnBlock
                            label1="Сохранить"
                            label2="Отмена"
                            label3="Удалить"
                            className1={`${styles["change-feedback"]} ${styles["save"]}`}
                            className2={`${styles["change-feedback"]} ${styles["cancel"]}`}
                            className3={`${styles["change-feedback"]} ${styles["delete"]}`}
                            className4={styles["change-button__block"]}
                            fnc1={() => handleSave(feedback.id)}
                            fnc2={() => setEditFeedbackId(null)}
                            fnc3={() => handleDelete(feedback.id)}
                            showThirdButton={true}
                          />
                        ) : (
                          feedback.id_client_from === clientId && (
                            <CustomButton
                              className={styles["change-feedback"]}
                              label="изменить"
                              onClick={() => handleEdit(feedback)}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {getBarberFeedbacks(item.id).length > feedbackLimit && (
            <CustomButton
              type="button"
              onClick={loadMoreFeedbacks}
              className={styles["load-more"]}
            >
              Загрузить еще
            </CustomButton>
          )}

          <div
            className={`${styles["feedBack-form"]} ${
              feedbackText
                ? styles["feedBack-textarea-active"]
                : feedbacks.length === 0
                ? styles["feedback-empty"]
                : ""
            }`}
          >
            {feedbackText.length > 0 && (
              <div className={styles["feedBack-estimation"]}>
                <h4>Оцените работу</h4>
                <RatingStars
                  isInteractive={true}
                  value={ratings[item.id]}
                  onRate={(newRating) => handleRate(item.id, newRating)}
                />
              </div>
            )}
            <textarea
              placeholder="Оставьте ваш отзыв..."
              value={feedbackText}
              onChange={handleFeedbackChange}
              style={{ height }}
            />

            <BtnBlock
              label1="Отмена"
              label2="Оставить комментарий"
              className1={styles["cancel"]}
              className2={`${styles["post-feedback"]} ${
                isFeedbackDisabled ? styles.disabled : ""
              }`}
              className4={styles["feedBack-button__block"]}
              fnc1={() => showFeedBackToggle(item)}
              fnc2={(e) => {
                if (isFeedbackDisabled) {
                  e.preventDefault();
                  return;
                }
                handleSubmitFeedback();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackSection;
