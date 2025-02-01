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
}) => {
  const getPositionText = (position) => positionMap[position];

  const positionMap = {
    1: "Женский парикмахер",
    2: "Мужской парикмахер",
    3: "Специалист по маникюру",
    4: "Бровист",
    5: "Специалист по ресницам",
  };
  return (
    <div className={styles.wrapper} onClick={handleSignUpClick}>
      <div className={styles["about-barber"]}>
        <div>
          <img
            className={styles["barber-avatar"]}
            src={item.imageLink || avatar}
            alt=""
          />
        </div>
        <div>
          <p className={styles["barber-item"]}>Имя: {item.firstName}</p>
          <p className={styles["barber-item"]}>Фамилия: {item.lastName}</p>
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
  );
};

export default Barbers;
