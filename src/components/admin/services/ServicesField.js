import React from "react";

import ServiceList from "./serviceList/ServiceList";
import Modal from "../../modal/Modal";
import CustomButton from "../../customButton/CustomButton";
import { ServiceFieldState } from "../../hooks/services/ServicesFieldState";
import styles from "./servicesField.module.scss";
import Spinner from "../../spinner/Spinner";
import FilterBlock from "./filterBlock/FilterBlock";
import AddService from "./addService/AddService";

const ServiceField = () => {
  const {
    handleSubmit,

    setServices,
    loading,
    addService,
    activeInput,
    setActiveInput,
    errorMessage,
    selectedCategory,
    setSelectedCategory,
    categories,
    getCategoryTextById,
    toggleOpen,
    toggleClose,
    uniqueCategories,
    filteredServices,
    setLoading,
    setErrorMessage,
    dur,
    durationToText,
  } = ServiceFieldState();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["service-field"]}>
      {errorMessage && <>Что-то не так...</>}
      <div className={styles.wrapper}>
        <CustomButton
          className={styles["gr-btn"]}
          label="Добавить услугу"
          onClick={toggleOpen}
        />
        <FilterBlock
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          uniqueCategories={uniqueCategories}
          getCategoryTextById={getCategoryTextById}
        />
      </div>

      {addService && (
        <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
          <h2>Добавить Услугу</h2>
          <AddService
            handleSubmit={handleSubmit}
            setLoading={setLoading}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            categories={categories}
            setServices={setServices}
            toggleClose={toggleClose}
            setErrorMessage={setErrorMessage}
            dur={dur}
          />
        </Modal>
      )}

      <ServiceList
        services={filteredServices}
        setServices={setServices}
        toggleClose={toggleClose}
        toggleOpen={toggleOpen}
        categories={categories}
        dur={dur}
        durationToText={durationToText}
        getCategoryTextById={getCategoryTextById}
      />
    </div>
  );
};

export default ServiceField;
