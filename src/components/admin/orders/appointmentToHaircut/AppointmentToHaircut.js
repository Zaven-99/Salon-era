import React, { useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { clearBarber } from "../../../../store/slices/barberSlice.js";
import { clearServices } from "../../../../store/slices/serviceSlice.js";

import Spinner from "../../../spinner/Spinner";
import styles from "./appointmentToHaircut.module.scss";
const AppointmentToHaircut = ({
  setAddOrderModal,
  toggleOpen,
  addOrderModal,
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
  const [activeInput, setActiveInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [client, setClient] = useState(null);
  const [offerModal, setOfferModal] = useState(false);
  const [succesDelete, setSuccesDelete] = useState(false);
  const [succesSignUp, setSuccesSignUp] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [confirmDeleteClient, setConfirmDeleteClient] = useState(false);

  const dispatch = useDispatch();
  const selectedBarber = useSelector((state) => state.barber.selectedBarber);

  const enroll = async () => {
    setLoading(true);
    if (selectedServices.length === 0 || !selectedBarber || !selectedTime) {
      alert("Пожалуйста, выберите услуги, мастера и время.");
    }

    const selectedService = selectedServices[0];

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id_client_from: client.id,
        id_client_to: selectedBarber.id,
        id_service: selectedService.id,
        number: "",
        status: 0,
        dateRecord: formattedDateTimeForServer(),
      })
    );

    try {
      const response = await fetch("https://api.salon-era.ru/records", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }
    } catch (error) {
      alert("Извините произошла ошибка!");
    } finally {
      setLoading(false);
      toggleClose();
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/clients?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении клиента");
      closeMessageDeleteClients();
      setSuccesDelete(true);
      setClient(null);
      setTimeout(() => {
        setSuccesDelete(false);
      }, 1000);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const closeMessageDeleteClients = () => {
    setConfirmDeleteClient(false);
    setClientToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const toggleClose = () => {
    setAddOrderModal(false);
    setSelectedTime(null);
    dispatch(clearServices());
    dispatch(clearBarber());
    document.body.style.overflow = "scroll";
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;

    if (value === "+7" && e.key === "Backspace") {
      e.preventDefault();
      return;
    }

    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }

    if (value.length >= 12 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const formattedDateTimeForServer = () => {
    if (!selectedTime) return null;

    const year = selectedTime.getFullYear();
    const month = String(selectedTime.getMonth() + 1).padStart(2, "0");
    const day = String(selectedTime.getDate()).padStart(2, "0");
    const hours = String(selectedTime.getHours()).padStart(2, "0");
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  const uniqueCategories = [
    ...new Set(
      services
        .map((service) => service.category)
        .filter(
          (category) => typeof category === "string" && category.trim() !== ""
        )
    ),
  ];

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
              uniqueCategories={uniqueCategories}
              setServices={setServices}
              services={services}
            />
          )}

          {client && uniqueCategories && selectedServices.length > 0 && (
            <BarbersBlock />
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
            uniqueCategories &&
            selectedServices.length > 0 &&
            selectedBarber &&
            selectedTime && (
              <CustomButton
                className={styles["signUp-button"]}
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
            className1={styles["delete-client"]}
            className2={styles["cancel-delete__client"]}
            className3={styles["btn-block"]}
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
