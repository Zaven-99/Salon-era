import React from "react";
import Spinner from "../../../../spinner/Spinner";
import { ServicesBlockState } from "../../../../hooks/servicesBlock/ServicesBlockState";

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
  const {
    loading,
    error,
    filteredGroupedServices,
    toggleChooseService,
    selectedServices,
  } = ServicesBlockState({
    addOrderModal,
    services,
    setServices,
    selectedCategory,
  });

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
                {Object.keys(genderServices).map((category, index) => (
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
                              toggleChooseService(existingService.id, category); // Используем хук
                            }
                          } else {
                            toggleChooseService(selectedServiceId, category); // Используем хук
                          }
                        }}
                      >
                        <option value="">Выберите услугу</option>
                        {genderServices[category].map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name} - {item.priceLow} 
                            {item.priceMax ? `- ${item.priceMax}` : ''} руб.
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ServicesBlock;
