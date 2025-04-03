import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  removeService,
} from "../../../../../store/slices/serviceSlice";

import Spinner from "../../../../spinner/Spinner";
import styles from "./servicesBlock.module.scss";

const ServicesBlock = ({
  addOrderModal,
  setServices,
  services,
  getCategoryTextById,
  categoryOptions,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  const dispatch = useDispatch();

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

  const toggleChooseService = (serviceId, category) => {
    if (!serviceId) return;

    const service = services.find(
      (s) =>
        s.id === Number(serviceId) && String(s.category) === String(category)
    );
    if (!service) return;

    const isServiceSelected = selectedServices.some((s) => s.id === service.id);
    if (isServiceSelected) {
      dispatch(removeService(service.id));
    } else {
      dispatch(addService(service));
    }
  };

  const filteredGroupedServices = selectedCategory
    ? Object.keys(groupedServices).reduce((acc, genderKey) => {
        if (!groupedServices[genderKey]) return acc; // Added check for null
        acc[genderKey] = Object.keys(groupedServices[genderKey]).reduce(
          (categoryAcc, category) => {
            if (selectedCategory === category) {
              categoryAcc[category] = groupedServices[genderKey][category];
            }
            return categoryAcc;
          },
          {}
        );
        return acc;
      }, {})
    : groupedServices;

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
    if (addOrderModal) {
      fetchServices();
    } else {
      return;
    }
  }, [addOrderModal]);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>Что-то пошло не так...</p>;
  }

  return (
    <>
      <h3>Категории</h3>

      <select
        className={styles.select}
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">Выберите категорию</option>
        {categoryOptions.map((category, index) => (
          <option key={index} value={category.id}>
            {category.value}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <ul>
          {Object.keys(filteredGroupedServices).map((genderKey, index) => {
            const genderServices = filteredGroupedServices[genderKey];

            const hasServices = Object.keys(genderServices).length > 0;

            if (!hasServices) return null;

            return (
              <div key={index}>
                {Object.keys(genderServices).map((category, index) => {
                  return (
                    <div className={styles["price-list"]} key={index}>
                      <div className={styles["selected-services__container"]}>
                        <h3 className={styles.category}>
                          {getCategoryTextById(category)}
                        </h3>
                      </div>

                      <div className={styles.wrapper}>
                        <select
                          className={styles.select}
                          value={
                            selectedServices.find(
                              (s) => String(s.category) === String(category)
                            )?.id || ""
                          }
                          onChange={(e) => {
                            const selectedServiceId = e.target.value;

                            if (!selectedServiceId) {
                              const existingService = selectedServices.find(
                                (s) => String(s.category) === String(category)
                              );
                              if (existingService) {
                                dispatch(removeService(existingService.id));
                              }
                            } else {
                              toggleChooseService(selectedServiceId, category);
                            }
                          }}
                        >
                          <option value="">Выберите услугу</option>
                          {genderServices[category].map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name} - {item.priceLow} -{" "}
                              {item.priceMax || item.priceLow} руб.
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ServicesBlock;
