import React, { useState, useEffect } from "react";
import {
  addService,
  removeService,
} from "../../../../store/slices/serviceSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../use-auth/use-auth";

import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";

import styles from "./chooseAService.module.scss";
import Service from "./Service";

const ChooseAService = ({ handleSignUpClick }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className={styles["choose-service"]}>
      <h1 className={styles.signUpForAHaircut}>Записаться</h1>
      <div className={styles["sign-up_for__haircut"]}>
        <div className={styles["selected-services__container"]}>
          {selectedServicesCount > 0 && token && (
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
          {Object.keys(groupedServices).map((genderKey) => (
            <div key={genderKey}>
              <span className={styles.gender}>
                {genderKey == 1 ? "Мужские услуги" : "Женские услуги"}
              </span>
              {Object.keys(groupedServices[genderKey]).map((category) => (
                <div className={styles["price-list"]} key={category}>
                  <h3 className={styles.category}>{category}</h3>
                  {token ? (
                    <Service
                      groupedServices={groupedServices}
                      genderKey={genderKey}
                      category={category}
                      toggleChooseService={toggleChooseService}
                      selectedServices={selectedServices}
                      getDurationText={getDurationText}
                    />
                  ) : (
                    <div onClick={handleSignUpClick}>
                      <Service
                        groupedServices={groupedServices}
                        genderKey={genderKey}
                        category={category}
                        toggleChooseService={toggleChooseService}
                        selectedServices={selectedServices}
                        getDurationText={getDurationText}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ChooseAService;
