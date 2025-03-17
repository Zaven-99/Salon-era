import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectChosenBarber } from "../../../../../store/slices/action";

import styles from "./barbersBlock.module.scss";
import Spinner from "../../../../spinner/Spinner";

const BarbersBlock = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const selectedBarber = useSelector((state) => state.barber.selectedBarber);

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const filteredBarbers = useMemo(() => {
    return barbers?.filter((barber) => {
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
    });
  }, [barbers, selectedServices]);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>Что-то пошло не так...</p>;
  }
  return (
    <div>
      <h3>Мастеры</h3>
      {filteredBarbers.map((item, index) => (
        <div
          className={`${styles.barbers} ${
            selectedBarber && selectedBarber.id === item.id
              ? styles.selectedBarber
              : ""
          }`}
          onClick={() => handleSelectBarber(item)}
          key={index}
        >
          <p>{item.firstName}</p>
          <p>{item.lastName}</p>
        </div>
      ))}
    </div>
  );
};

export default BarbersBlock;
