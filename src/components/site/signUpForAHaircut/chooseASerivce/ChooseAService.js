import React from "react";
import Service from "./service/Service";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";
import { ChooseAServiceState } from "../../../hooks/signUpForHaircut/ChooseAServiceState";
import styles from "./chooseAService.module.scss";
import FilterBlock from "../../../filterBlock/FilterBlock";

const ChooseAService = () => {
  const {
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedServices,
    toggleChooseService,
    getDurationText,
    getCategoryTextById,
    filteredGroupedServices,
    navigate,
    uniqueCategories,
    services,
  } = ChooseAServiceState();

  if (loading) {
    return <Spinner />;
  }
  if (!services.length) {
    return (
      <p className={styles.message}>
        Упс! Не удалось загрузить список услуг. Мы уже работаем над этим.
        Загляните чуть позже!
      </p>
    );
  }

  return (
    <section className={styles["choose-service"]}>
      <h1 data-aos="fade-right" className={styles.signUpForAHaircut}>
        Записаться
      </h1>

      <div className={styles["sign-up_for__haircut"]}>
        <FilterBlock
          uniqueCategories={uniqueCategories}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          getCategoryTextById={getCategoryTextById}
        />
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
                      Number(service.category) === Number(category) &&
                      Number(service.gender) === Number(genderKey)
                  );

                  return (
                    <div
                      data-aos="fade-right"
                      className={styles["price-list"]}
                      key={category}
                    >
                      <div className={styles["selected-services__container"]}>
                        <h3 className={styles.category}>
                          {getCategoryTextById(category)}
                        </h3>

                        {selectedInCategory && (
                          <div className={styles["button-wrapper"]}>
                            <div className={styles["next-button"]}>
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
