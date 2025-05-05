import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChosenBarber } from "../../../../../store/slices/action";
import Spinner from "../../../../spinner/Spinner";

import styles from "./barbersBlock.module.scss";

const BarbersBlock = ({ barbers, loading, selectedCategory }) => {
  const dispatch = useDispatch();

  const selectedBarber = useSelector((state) => state.barber.selectedBarber);

  const handleSelectBarber = (barber) => {
    dispatch(selectChosenBarber(barber));
  };

  if (barbers.length === 0) {
    return <p>Нет доступных мастеров для выбранных услуг.</p>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {selectedCategory && (
        <>
          <h3>Мастера</h3>
          {barbers.map((item) => (
            <div
              className={`${styles.barbers} ${
                selectedBarber && selectedBarber.id === item.id
                  ? styles.selectedBarber
                  : ""
              }`}
              onClick={() => handleSelectBarber(item)}
              key={item.id}
            >
              <p>
                {item.firstName} {item.lastName}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BarbersBlock;
