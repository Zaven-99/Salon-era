import React from "react";
import CustomButton from "../../../../customButton/CustomButton";
import BtnBlock from "../../../../btnBlock/BtnBlock";
import { FeedbackSectionState } from "../../../../hooks/signUpForHaircut/FeedbackSectionState";
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
  const {
    user,
    clientId,
    editedFeedbackText,
    editFeedbackId,
    feedbackLimit,
    height,
    handleEdit,
    handleDelete,
    handleSave,
    handleChange,
    handleFeedbackChange,
    handleRate,
    loadMoreFeedbacks,
    formatDate,
    getBarberFeedbacks,
    isFeedbackDisabled,
    handleSubmitFeedback,
    setEditFeedbackId,
  } = FeedbackSectionState({
    setFeedbackText,
    setLoading,
    setFeedbacks,
    feedbacks,
    setRatings,
    selectedBarber,
    handleGetFeedback,
    feedbackText,
    ratings,
  });

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
