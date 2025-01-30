import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../../use-auth/use-auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectChosenBarber } from "../../../../store/slices/action";

import styles from "./chooseABarbers.module.scss";

import exc from "../../../../img/icons/exc.svg";
import CustomButton from "../../../customButton/CustomButton";
import RatingStars from "../../../ratingStars/RatingStars";
import avatar from "../../../../img/icons/avatar.png";
import Spinner from "../../../spinner/Spinner";

const ChooseABarbers = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackBarber, setFeedbackBarber] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [editedFeedbackText, setEditedFeedbackText] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [ratings, setRatings] = useState({});
  const [feedbackLimit, setFeedbackLimit] = useState(5);
  const [initialHeight, setInitialHeight] = useState("25px");

  const [height, setHeight] = useState(initialHeight);

  const { id: clientId } = useAuth();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const positionMap = {
    1: "Женский парикмахер",
    2: "Мужской парикмахер",
    3: "Специалист по маникюру",
    4: "Бровист",
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

  const getPositionText = (position) => positionMap[position];
  const selectedBarber = useSelector((state) => state.barber.selectedBarber);
  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );
  const handleClickPrev = () => {
    navigate("/");
  };

  const handleSelectBarber = (barber) => {
    dispatch(selectChosenBarber(barber));
  };

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all");
      if (!response.ok) {
        throw new Error("Ошибка при получении барберов");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.salon-era.ru/feedbacks/all`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Ошибка при получении фидбеков");
      }

      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
    handleGetFeedback();
  }, []);

  const showFeedBackToggle = (barber) => {
    setFeedbackBarber((prev) =>
      prev && prev.id === barber.id ? null : barber
    );
    setFeedbackText("");
    setRatings((prevRatings) => ({
      ...prevRatings,
      [barber.id]: prevRatings[barber.id] || 0,
    }));
  };

  const filteredBarbers = useMemo(() => {
    return clients.filter((barber) => {
      const isMaleServiceSelected = selectedServices.some(
        (service) => service.gender === 1
      );

      if (isMaleServiceSelected) {
        return barber.clientType === "employee" && barber.position === "2";
      }

      return barber.clientType === "employee" && barber.position !== "2";
    });
  }, [clients, selectedServices]);

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

  const handleEdit = (feedBack) => {
    setEditFeedbackId(feedBack.id);

    setEditedFeedbackText(feedBack);

    setHeight(initialHeight);
  };

  const getAverageRating = (barberId) => {
    const barberFeedbacks = feedbacks.filter(
      (feedback) => feedback.id_client_to === barberId
    );
    if (barberFeedbacks.length === 0) return 0;
    const totalRating = barberFeedbacks.reduce(
      (sum, feedback) => sum + feedback.value,
      0
    );
    return totalRating / barberFeedbacks.length;
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

  const getFeedbackCount = (barberId) => {
    return feedbacks.filter((feedback) => feedback.id_client_to === barberId)
      .length;
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
  if (loading) {
    return <Spinner />;
  }

  if (error) return <div>Ошибка: {error}</div>;

  return (
    <section>
      <h1 className={styles.signUpForAHaircut}>Записаться</h1>

      <h1>Специалисты</h1>
      <div className={styles["choose-a__barbers"]}>
        <div className={styles["wrapper"]}>
          <div className={styles.back} onClick={handleClickPrev}>
            Назад
          </div>
          <div>
            {selectedBarber ? (
              <div className={styles["navigate-button__container"]}>
                <CustomButton
                  onClick={() => navigate("/select-barbers/select-date")}
                  type="button"
                  label="выбрать дату"
                  className={styles["choose-date"]}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {filteredBarbers.map((item) => {
          const averageRating = getAverageRating(item.id);
          const feedbackCount = getFeedbackCount(item.id);

          return (
            <div
              onClick={() => handleSelectBarber(item)}
              key={item.id}
              className={`${styles.barbers} ${
                selectedBarber && selectedBarber.id === item.id
                  ? styles.selectedBarber
                  : ""
              }`}
            >
              <div className={styles.wrapper}>
                <div className={styles["about-barber"]}>
                  <div>
                    <img
                      className={styles["barber-avatar"]}
                      src={item.imageLink || avatar}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className={styles["barber-item"]}>
                      Имя: {item.firstName}
                    </p>
                    <p className={styles["barber-item"]}>
                      Фамилия: {item.lastName}
                    </p>
                    <p className={styles["barber-item"]}>
                      Должность: {getPositionText(item.position)}
                    </p>
                    <RatingStars
                      isInteractive={false}
                      value={averageRating}
                      count={feedbackCount}
                    />
                  </div>
                </div>
                <CustomButton
                  className={styles.exclamation}
                  type="button"
                  onClick={() => showFeedBackToggle(item)}
                >
                  <img src={exc} alt="Иконка восклицания" />
                </CustomButton>
              </div>

              {feedbackBarber && feedbackBarber.id === item.id && (
                <div
                  className={`${styles.feedBack} ${
                    feedbackBarber ? styles.open : "сlose"
                  }`}
                >
                  <h3>Отзывы:</h3>
                  <div className={styles["feedback-list"]}>
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
                            <div
                              className={styles["user-feedback__block__inner"]}
                            >
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
                                      <p>{feedback.text}</p>
                                      <p>{formatDate(feedback.createdAt)}</p>
                                    </div>
                                  )}
                                </div>
                                {feedback.id === editFeedbackId ? (
                                  <div
                                    className={styles["change-button__block"]}
                                  >
                                    <CustomButton
                                      type="button"
                                      onClick={() => handleSave(feedback.id)}
                                      className={`${styles["change-feedback"]} ${styles["save"]}`}
                                    >
                                      Сохранить
                                    </CustomButton>
                                    <CustomButton
                                      type="button"
                                      onClick={() => setEditFeedbackId(null)}
                                      className={`${styles["change-feedback"]} ${styles["cancel"]}`}
                                    >
                                      Отмена
                                    </CustomButton>
                                    <CustomButton
                                      type="button"
                                      onClick={() => handleDelete(feedback.id)}
                                      className={`${styles["change-feedback"]} ${styles["delete"]}`}
                                    >
                                      Удалить
                                    </CustomButton>
                                  </div>
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
                      feedbackText ? styles["feedBack-textarea-active"] : ""
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

                    <div className={styles["feedBack-button__block"]}>
                      <CustomButton
                        type="button"
                        onClick={() => showFeedBackToggle(item)}
                        className={styles["post-feedback"]}
                      >
                        Отмена
                      </CustomButton>
                      <CustomButton
                        type="button"
                        onClick={(e) => {
                          if (isFeedbackDisabled) {
                            e.preventDefault();
                            return;
                          }
                          handleSubmitFeedback();
                        }}
                        disabled={isFeedbackDisabled}
                        className={`${styles["post-feedback"]} ${
                          isFeedbackDisabled ? styles.disabled : ""
                        }`}
                      >
                        Отправить
                      </CustomButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ChooseABarbers;
