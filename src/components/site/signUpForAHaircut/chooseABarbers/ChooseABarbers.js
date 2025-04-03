import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectChosenBarber } from "../../../../store/slices/action";
import { useAuth } from "../../../../use-auth/use-auth";

import CustomButton from "../../../customButton/CustomButton";
import RatingStars from "../../../ratingStars/RatingStars";
import FeedbackSection from "./feedbackSection/FeedbackSection";
import Barbers from "./barbers/Barbers";

import avatar from "../../../../img/icons/avatar.png";
import Spinner from "../../../spinner/Spinner";
import styles from "./chooseABarbers.module.scss";

const ChooseABarbers = ({ handleSignUpClick }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackBarber, setFeedbackBarber] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [categories, setCategories] = useState([])

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
      setBarbers(data);
      console.log(data)
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
    // Если selectedServices пустой, то не показываем барберов
    if (selectedServices.length === 0) return [];

    return barbers.filter((barber) => {
      // Убедимся, что barber.arrayTypeWork существует и является массивом
      if (
        !Array.isArray(barber.arrayTypeWork) ||
        barber.arrayTypeWork.length === 0
      ) {
        return false;
      }

      // Проверяем, что clientType равен "employee"
      if (barber.clientType !== "employee") {
        return false;
      }

      // Получаем все ID должностей из выбранных услуг
      const selectedCategoryIds = selectedServices.map(
        (service) => service.category
      );

      // Проверяем, если хотя бы одна из должностей барбера содержится в выбранных услугах
      const isMatchingCategory = barber.arrayTypeWork.some((id) =>
        selectedCategoryIds.includes(id)
      );

      // Если должность барбера не совпадает с выбранной категорией, то он должен отображаться
      return !isMatchingCategory;
    });
  }, [barbers, selectedServices]);

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

  const fetchCategory = async () => {
      try {
        const response = await fetch("https://api.salon-era.ru/catalogs/all");
  
        if (!response.ok) {
          throw new Error(`Ошибка http! статус: ${response.status}`);
        }
  
        const data = await response.json();
        setCategories(data);
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCategory();
    }, []);
  
    const categoryOptions = categories.filter(
      (item) => item.category === "Должность"
    );

  const getCategoryTextById = (id) => {
    const categoryId = Number(id); // Приводим id категории к числу
    const category = categoryOptions.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
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
                  getCategoryTextById={getCategoryTextById}
                />
              ) : (
                <Barbers
                  averageRating={averageRating}
                  feedbackCount={feedbackCount}
                  item={item}
                  avatar={avatar}
                  showFeedBackToggle={showFeedBackToggle}
                  handleSignUpClick={handleSignUpClick}
                  getCategoryTextById={getCategoryTextById}
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
