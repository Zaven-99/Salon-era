import React from "react";
import CustomInput from "../../../../customInput/CustomInput";
import CustomButton from "../../../../customButton/CustomButton";
import { useForm } from "react-hook-form";

import styles from "./searchBlock.module.scss";

const SearchBlock = ({
  setClient,
  setOfferModal,
  activeInput,
  setActiveInput,
  handleKeyDown,
  setSelectedTime,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      phone: "",
    },
  });
  const handleSearchClients = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/clients/all", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }

      const clients = await response.json();
      const phoneNumber = watch("phone");

      const foundClient = clients.find(
        (client) => client.phone === phoneNumber
      );

      if (foundClient) {
        setClient(foundClient);
      } else {
        setOfferModal(true);
      }
    } catch (error) {
      alert("Извините произошла ошибка!");
    } finally {
    }
  };
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
