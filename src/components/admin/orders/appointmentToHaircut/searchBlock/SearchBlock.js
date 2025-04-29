import React from "react";
import CustomInput from "../../../../customInput/CustomInput";
import CustomButton from "../../../../customButton/CustomButton";
import { SearchClient } from "../../../../hooks/appointmentToHaircut/SearchBlock";
import styles from "./searchBlock.module.scss";
import Spinner from "../../../../spinner/Spinner";

const SearchBlock = ({
  setClient,
  setOfferModal,
  activeInput,
  setActiveInput,
  handleKeyDown,
  setSelectedTime,
}) => {
  const { register, errors, loading, handleSearchClients } = SearchClient({
    setClient,
    setOfferModal,
  });

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <CustomInput
        label="Введите номер телефона:"
        error={errors.phone}
        name="phone"
        type="tel"
        isActive={activeInput === "phone"}
        setActiveInput={setActiveInput}
        onKeyDown={handleKeyDown}
        setClient={setClient}
        setSelectedTime={setSelectedTime}
        {...register("phone", {
          required: "Это поле обязательно",
          pattern: {
            value: /^\+7\d{10}$/,
            message: "Неккоректный номер телефона",
          },
        })}
      />

      <CustomButton
        className={styles["search-button"]}
        onClick={handleSearchClients}
        label="Найти клиента"
        disabled={errors.phone ? true : false}
      />
    </div>
  );
};

export default SearchBlock;
