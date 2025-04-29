import React from "react";
import Modal from "../../../modal/Modal";
import CustomButton from "../../../customButton/CustomButton";
import BarbersBlock from "./barbersBlock/BarbersBlock.js";
import ServicesBlock from "./servicesBlock/ServicesBlock.js";
import CalendarBlock from "./calendarBlock/CalendarBlock.js";
import SearchBlock from "./searchBlock/SearchBlock.js";
import ClientBlock from "./clientBlock/ClientBlock.js";
import SignUpBlock from "./signUpBlock/SignUpBlock.js";
import BtnBlock from "../../../btnBlock/BtnBlock.js";
import { useForm } from "react-hook-form";

import { AppointmentToHaircutState } from "./../../../hooks/appointmentToHaircut/AppointmentToHaircutState.js";

import Spinner from "../../../spinner/Spinner";
import styles from "./appointmentToHaircut.module.scss";

const AppointmentToHaircut = ({
  toggleOpen,
  addOrderModal,
  setAddOrderModal,
}) => {
  useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  });
  const {
    loading,
    setLoading,
    activeInput,
    setActiveInput,
    selectedTime,
    setSelectedTime,
    services,
    setServices,
    client,
    setClient,
    offerModal,
    setOfferModal,
    succesDelete,
    succesSignUp,
    setSuccesSignUp,
    clientToDelete,
    confirmDeleteClient,
    setClientToDelete,
    setConfirmDeleteClient,
    selectedCategory,
    setSelectedCategory,
    selectedBarber,
    selectedServices,
    filteredBarbers,
    categoryOptions,
    getCategoryTextById,
    enroll,
    toggleClose,
    handleDelete,
    closeMessageDeleteClients,
    handleKeyDown,
    // addOrderModal,
  } = AppointmentToHaircutState({ addOrderModal, setAddOrderModal });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
        <div className={styles["enrol-form"]}>
          <h3>Записать на услугу</h3>
          <SearchBlock
            setClient={setClient}
            setOfferModal={setOfferModal}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            handleKeyDown={handleKeyDown}
            setSelectedTime={setSelectedTime}
          />
          <ClientBlock
            setLoading={setLoading}
            setClientToDelete={setClientToDelete}
            setConfirmDeleteClient={setConfirmDeleteClient}
            client={client}
            toggleOpen={toggleOpen}
            toggleClose={toggleClose}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
            handleKeyDown={handleKeyDown}
          />

          {client && (
            <ServicesBlock
              addOrderModal={addOrderModal}
              setServices={setServices}
              services={services}
              getCategoryTextById={getCategoryTextById}
              categoryOptions={categoryOptions}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          )}

          {client && selectedServices.length > 0 && (
            <BarbersBlock
              selectedCategory={selectedCategory}
              barbers={filteredBarbers}
              loading={loading}
            />
          )}
          {client && selectedBarber && (
            <CalendarBlock
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedServices={selectedServices}
              selectedBarber={selectedBarber}
            />
          )}
          {client &&
            selectedServices.length > 0 &&
            selectedBarber &&
            selectedTime && (
              <CustomButton
                className={styles["b-btn"]}
                label="Записать"
                onClick={enroll}
              />
            )}
        </div>
      </Modal>
      {offerModal && (
        <SignUpBlock
          setSuccesSignUp={setSuccesSignUp}
          setLoading={setLoading}
          setClient={setClient}
          setOfferModal={setOfferModal}
          activeInput={activeInput}
          setActiveInput={setActiveInput}
          handleKeyDown={handleKeyDown}
        />
      )}
      {succesSignUp && (
        <div className={styles["succes-message"]}>
          Клиент успешно зарегистрирован
        </div>
      )}
      {succesDelete && (
        <div className={styles["succes-message"]}>Клиент успешно удален</div>
      )}
      {confirmDeleteClient && clientToDelete && (
        <Modal toggleClose={toggleClose} toggleOpen={toggleOpen}>
          <h2 className={styles["choose"]}>
            Вы действительно хотите удалить аккаунт?
          </h2>
          <BtnBlock
            className1={styles["g-btn"]}
            className2={styles["r-btn"]}
            className4={styles["btn-block"]}
            label1="Удалить аккаунт"
            label2="Отменить удаление"
            fnc1={() => handleDelete(clientToDelete)}
            fnc2={closeMessageDeleteClients}
          />
        </Modal>
      )}
    </div>
  );
};

export default AppointmentToHaircut;
