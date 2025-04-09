import React, { useState, useEffect, useMemo } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories, setCategories] = useState([]);
  const [barbers, setBarbers] = useState([]);

  const dispatch = useDispatch();
  const selectedBarber = useSelector((state) => state.barber.selectedBarber);
  const selectedServices = useSelector(
    (state) => state.service.selectedServices
  );

  // Fetch data for barbers and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersResponse, categoriesResponse] = await Promise.all([
          fetch("https://api.salon-era.ru/clients/all"),
          fetch("https://api.salon-era.ru/catalogs/all"),
        ]);

        if (!barbersResponse.ok || !categoriesResponse.ok) {
          throw new Error("Ошибка загрузки данных");
        }

        const barbersData = await barbersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setBarbers(barbersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchData();
  }, []);

  const filteredBarbers = useMemo(() => {
    // Если selectedServices пустой, то не показываем барберов
    if (selectedServices.length === 0) return [];

    return barbers.filter((barber) => {
      // Убедимся, что barber.arrayTypeWork существует и является массивом
      if (
        !Array.isArray(barber.arrayTypeWork) ||
        barber.arrayTypeWork.length === 0
      ) {
        return false;
      }

      // Проверяем, что clientType равен "employee"
      if (barber.clientType !== "employee") {
        return false;
      }

      // Получаем все ID должностей из выбранных услуг
      const selectedCategoryIds = selectedServices.map(
        (service) => service.category
      );

      // Проверяем, если хотя бы одна из должностей барбера содержится в выбранных услугах
      const isMatchingCategory = barber.arrayTypeWork.some((id) =>
        selectedCategoryIds.includes(id)
      );

      // Если должность барбера не совпадает с выбранной категорией, то он должен отображаться
      return !isMatchingCategory;
    });
  }, [barbers, selectedServices]);

  const fetchCategroy = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");

      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategroy();
  }, []);

  const getCategoryTextById = (id) => {
    const categoryId = Number(id);
    const category = categories.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const categoryOptions = categories.filter(
    (item) => item.category === "Категория услуг"
  );

  const enroll = async () => {
    setLoading(true);
    if (selectedServices.length === 0 || !selectedBarber || !selectedTime) {
      alert("Пожалуйста, выберите услуги, мастера и время.");
    }

    const selectedService = selectedServices[0];

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          id_client_from: client.id,
          id_client_to: selectedBarber.id,
          id_service: selectedService.id,
          number: "",
          status: 0,
          dateRecord: formattedDateTimeForServer(),
        },
      ])
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

  const formattedDateTimeForServer = () => {
    if (!selectedTime) return null;

    const year = selectedTime.getFullYear();
    const month = String(selectedTime.getMonth() + 1).padStart(2, "0");
    const day = String(selectedTime.getDate()).padStart(2, "0");
    const hours = String(selectedTime.getHours()).padStart(2, "0");
    const minutes = String(selectedTime.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const toggleClose = () => {
    setAddOrderModal(false);
    setSelectedTime(null);
    dispatch(clearServices());
    dispatch(clearBarber());
    document.body.style.overflow = "scroll";
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
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      setSuccesDelete(false);
      document.body.style.overflow = "scroll";
    }
  };

  const closeMessageDeleteClients = () => {
    setConfirmDeleteClient(false);
    setClientToDelete(null);
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
