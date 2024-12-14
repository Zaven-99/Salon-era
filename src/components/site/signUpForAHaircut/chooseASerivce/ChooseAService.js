import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../use-auth/use-auth";
import {
  addService,
  removeService,
} from "../../../../store/slices/serviceSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";

import styles from "./chooseAService.module.scss";

const ChooseAService = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { gender } = useAuth();
  const dispatch = useDispatch();

  const getDurationText = (duration) => {
    const durations = {
      1: "30 минут",
      2: "1 час",
      3: "1ч 30 минут",
      4: "2 часа",
      5: "2ч 30 минут",
      6: "3ч",
      7: "3ч 30 минут",
      8: "4ч",
    };
    return durations[duration] || "Не указано";
  };

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );
  const selectedServicesCount = selectedServices.length;

  const toggleChooseService = (service) => {
    const isServiceSelected = selectedServices.some((s) => s.id === service.id);
    isServiceSelected
      ? dispatch(removeService(service.id))
      : dispatch(addService(service));
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://95.163.84.228:6533/services/all");
      if (!response.ok) throw new Error("Ошибка при получении услуг");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter((service) => service.gender === gender);
    setFilteredServices(filtered);
  }, [gender, services]);

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  if (loading) {
    return <Spinner />;
  }

  return (
    <section>
      <h1 className={styles.signUpForAHaircut}>Записаться</h1>
      <h1 className={styles["type-of__Price"]}>
        {gender === 0 ? "Женский прайс лист" : "Мужской прайс лист"}
      </h1>
      <div className={styles["sign-up_for__haircut"]}>
        <div className={styles["selected-services__container"]}>
          {selectedServicesCount > 0 && (
            <div className={styles["navigate-button__container"]}>
              <div className={styles["button-wrapper"]}>
                <CustomButton
                  className={styles["next-to__barber"]}
                  onClick={() => navigate("/select-barbers")}
                  label="Перейти к парикмахерам"
                  type="button"
                />
              </div>
            </div>
          )}
        </div>

        <ul>
          {Object.keys(groupedServices).map((category) => (
            <div key={category}>
              <h2 className={styles.category}>{category}</h2>

              <div className={styles.wrapper}>
                {groupedServices[category].map((item) => (
                  <div className={styles["priceList-inner"]} key={item.id}>
                    <div
                      onClick={() => toggleChooseService(item)}
                      className={`${styles["priceList-inner_item"]} ${
                        selectedServices.some((s) => s.id === item.id)
                          ? styles.selectedService
                          : ""
                      }`}
                    >
                      <p>Название:{item.name}</p>
                      <p>
                        {item.description && <>Описание: {item.description}</>}
                      </p>
                      <p>Продолжительность: {getDurationText(item.duration)}</p>
                      <div>
                        Цена:
                        {item.priceMax === null
                          ? `${item.priceLow} руб.`
                          : `${item.priceLow} - ${item.priceMax} руб.`}
                        {item.priceLow && item.priceMax && (
                          <div className={styles.clarify}>
                            Уточни у сотрудника!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ChooseAService;
