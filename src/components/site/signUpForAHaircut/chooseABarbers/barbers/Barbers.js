import React from "react";
import RatingStars from "../../../../ratingStars/RatingStars";
import CustomButton from "../../../../customButton/CustomButton";

import styles from "./barbers.module.scss";
import exc from "../../../../../img/icons/exc.svg";

const Barbers = ({
  averageRating,
  feedbackCount,
  item,
  avatar,
  showFeedBackToggle,
  handleSignUpClick,
  getCategoryTextById,
}) => {
  return (
    <div className={styles.wrapper} onClick={handleSignUpClick}>
      <div className={styles["about-barber"]}>
        <div>
          <img
            className={styles["barber-avatar"]}
            src={item?.imageLink || avatar}
            alt=""
          />
        </div>
        <div>
          <p className={styles["barber-item"]}>Имя: {item?.firstName}</p>
          <p className={styles["barber-item"]}>Фамилия: {item?.lastName}</p>
          <p className={styles["barber-item"]}>
            Должность: {getCategoryTextById(item?.position)}
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
  );
};

export default Barbers;
