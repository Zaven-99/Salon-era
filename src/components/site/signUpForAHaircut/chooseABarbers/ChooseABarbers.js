import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectChosenBarber } from "../../../../store/slices/action";
import { useAuth } from "../../../../use-auth/use-auth";

import styles from "./chooseABarbers.module.scss";

import CustomButton from "../../../customButton/CustomButton";
import RatingStars from "../../../ratingStars/RatingStars";
import avatar from "../../../../img/icons/avatar.png";
import Spinner from "../../../spinner/Spinner";
import FeedbackSection from "./feedbackSection/FeedbackSection";
import Barbers from "./barbers/Barbers";

const ChooseABarbers = ({ handleSignUpClick }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackBarber, setFeedbackBarber] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState({});

  const { token } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      // Проверка, есть ли выбрана услуга из категории женских стрижек
      const isFemaleHaircutSelected = selectedServices.some((service) =>
        [
          "Женские стрижки",
          "Укладка",
          "Краска волос 1 тон",
          "Мелирование",
          "Осветление",
          "Мелирование + тонирование",
          "Осветление + Тонирование",
          "Шлифовка волос",
          "Другое",
        ].includes(service.category.trim())
      );

      // Проверка, есть ли выбрана услуга из категории мужских стрижек
      const isMaleHaircutSelected = selectedServices.some((service) =>
        ["Мужские стрижки", "Остальное"].includes(service.category.trim())
      );

      // Проверка, есть ли выбрана услуга из категории маникюра
      const isManicureSelected = selectedServices.some((service) =>
        ["Маникюр", "Педикюр", "Укрепление ногтей"].includes(
          service.category.trim()
        )
      );

      // Проверка, есть ли выбрана услуга из категории бровей
      const isBrowServiceSelected = selectedServices.some((service) =>
        ["Оформление бровей"].includes(service.category.trim())
      );

      // Проверка, есть ли выбрана услуга из категории ресниц
      const isEyelashServiceSelected = selectedServices.some((service) =>
        ["Наращивание ресниц"].includes(service.category.trim())
      );

      // Фильтрация сотрудников в зависимости от выбранных услуг
      if (isFemaleHaircutSelected) {
        // Показываем только женских парикмахеров (position 1)
        return barber.clientType === "employee" && barber.position === "1";
      }

      if (isMaleHaircutSelected) {
        // Показываем только мужских парикмахеров (position 2)
        return barber.clientType === "employee" && barber.position === "2";
      }

      if (isManicureSelected) {
        // Показываем только специалистов по маникюру (position 3)
        return barber.clientType === "employee" && barber.position === "3";
      }

      if (isBrowServiceSelected) {
        // Показываем только бровистов (position 4)
        return barber.clientType === "employee" && barber.position === "4";
      }

      if (isEyelashServiceSelected) {
        // Показываем только специалистов по ресницам (position 5)
        return barber.clientType === "employee" && barber.position === "5";
      }

       
      navigate('/')
    });
  }, [clients, selectedServices]);

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

  const getFeedbackCount = (barberId) => {
    return feedbacks.filter((feedback) => feedback.id_client_to === barberId)
      .length;
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
            {selectedBarber && token && (
              <div className={styles["navigate-button__container"]}>
                <CustomButton
                  onClick={() => navigate("/select-barbers/select-date")}
                  type="button"
                  label="выбрать дату"
                  className={styles["choose-date"]}
                />
              </div>
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
              {token ? (
                <Barbers
                  averageRating={averageRating}
                  feedbackCount={feedbackCount}
                  item={item}
                  avatar={avatar}
                  showFeedBackToggle={showFeedBackToggle}
                />
              ) : (
                <Barbers
                  averageRating={averageRating}
                  feedbackCount={feedbackCount}
                  item={item}
                  avatar={avatar}
                  showFeedBackToggle={showFeedBackToggle}
                  handleSignUpClick={handleSignUpClick}
                />
              )}

              <FeedbackSection
                feedbackBarber={feedbackBarber}
                feedbackText={feedbackText}
                ratings={ratings}
                setFeedbackText={setFeedbackText}
                setLoading={setLoading}
                setFeedbacks={setFeedbacks}
                feedbacks={feedbacks}
                setRatings={setRatings}
                selectedBarber={selectedBarber}
                handleGetFeedback={handleGetFeedback}
                showFeedBackToggle={showFeedBackToggle}
                item={item}
                RatingStars={RatingStars}
                avatar={avatar}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ChooseABarbers;
