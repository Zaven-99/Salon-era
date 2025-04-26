import React from "react";
import { ChooseABarbersState } from "../../../hooks/signUpForHaircut/ChooseBarbersState";
import CustomButton from "../../../customButton/CustomButton";
import RatingStars from "../../../ratingStars/RatingStars";
import FeedbackSection from "./feedbackSection/FeedbackSection";
import Barbers from "./barbers/Barbers";
import { useNavigate } from "react-router-dom";

import avatar from "../../../../img/icons/avatar.png";
import Spinner from "../../../spinner/Spinner";
import styles from "./chooseABarbers.module.scss";

const ChooseABarbers = ({ handleSignUpClick }) => {
  const {
    token,
    selectedBarber,
    handleClickPrev,
    handleSelectBarber,
    filteredBarbers,
    feedbackBarber,
    feedbackText,
    setFeedbackText,
    ratings,
    setRatings,
    showFeedBackToggle,
    getAverageRating,
    getFeedbackCount,
    getCategoryTextById,
    loading,
    error,
    feedbacks,
    setFeedbacks,
    handleGetFeedback,
    setLoading,
  } = ChooseABarbersState();
  const navigate = useNavigate();

   

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
