import React, { useState, useEffect } from "react";
import {
  addService,
  removeService,
} from "../../../../store/slices/serviceSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service from "./service/Service";
import AOS from "aos";

import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";

import styles from "./chooseAService.module.scss";

const ChooseAService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
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

  const toggleChooseService = (service) => {
    const isServiceSelected = selectedServices.some((s) => s.id === service.id);
    isServiceSelected
      ? dispatch(removeService(service.id))
      : dispatch(addService(service));
  };

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      offset: 10,
    });
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка: ${response.status} - ${response.statusText} (${errorText})`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Ожидался JSON, но сервер вернул: ${contentType}`);
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Группировка сервисов по полу и категории
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.gender]) {
      acc[service.gender] = {};
    }
    if (!acc[service.gender][service.category]) {
      acc[service.gender][service.category] = [];
    }
    acc[service.gender][service.category].push(service);
    return acc;
  }, {});

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  // Уникальные категории для фильтрации
  const uniqueCategories = [
    ...new Set(services.map((service) => service.category)),
  ];

  // Фильтрация сервисов на основе выбранной категории
  const filteredGroupedServices = Object.keys(groupedServices).reduce(
    (acc, genderKey) => {
      acc[genderKey] = Object.keys(groupedServices[genderKey]).reduce(
        (categoryAcc, category) => {
          // Если категория выбрана, то фильтруем только по ней
          if (!selectedCategory || selectedCategory === category) {
            categoryAcc[category] = groupedServices[genderKey][category];
          }
          return categoryAcc;
        },
        {}
      );
      return acc;
    },
    {}
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["choose-service"]}>
      <h1 data-aos="fade-right" className={styles.signUpForAHaircut}>
        Записаться
      </h1>

      <div className={styles["sign-up_for__haircut"]}>
        <div className={styles["filter-block"]}>
          <p className={styles["filter-title"]}>Отфильтруйте по категориям</p>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filter}
          >
            <option value="">Все категории</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <ul>
          {Object.keys(filteredGroupedServices).map((genderKey) => {
            const genderServices = filteredGroupedServices[genderKey];

            const hasServices = Object.keys(genderServices).length > 0;

            if (!hasServices) return null;

            return (
              <div key={genderKey}>
                <span data-aos="fade-right" className={styles.gender}>
                  {genderKey === "1" ? "Мужские услуги" : "Женские услуги"}
                </span>

                {Object.keys(genderServices).map((category) => {
                  const selectedInCategory = selectedServices.some(
                    (service) =>
                      service.category === category &&
                      service.gender == genderKey
                  );

                  return (
                    <div
                      data-aos="fade-right"
                      className={styles["price-list"]}
                      key={category}
                    >
                      <div className={styles["selected-services__container"]}>
                        <h3 className={styles.category}>{category}</h3>
                        {selectedInCategory && (
                          <div
                            className={
                              selectedServices
                                ? styles["animated"]
                                : styles["navigate-button__container"]
                            }
                          >
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

                      <Service
                        groupedServices={filteredGroupedServices}
                        genderKey={genderKey}
                        category={category}
                        toggleChooseService={toggleChooseService}
                        selectedServices={selectedServices}
                        getDurationText={getDurationText}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ChooseAService;
