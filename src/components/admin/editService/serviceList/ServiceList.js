import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../modal/Modal";
import BtnBlock from "../../../btnBlock/BtnBlock";
import EditModal from "./editModal/EditModal";
import ServiceBlock from "./serviceBlock/ServiceBlock";
import styles from "./servicesList.module.scss";
import Spinner from "../../../spinner/Spinner";

const ServiceList = ({ services, setServices, toggleClose, toggleOpen }) => {
  const { setError } = useForm({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      category: "",
      description: "",
      duration: "1",
      priceLow: null,
      priceMax: null,
      gender: "",
      imageLink: "",
    },
  });
  const [serviceId, setServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [confirmDeleteService, setConfirmDeleteService] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const genderMap = { 0: "Женский", 1: "Мужской" };
  const durationMap = [
    "30 минут",
    "1 час",
    "1ч 30 минут",
    "2 часа",
    "2ч 30 минут",
    "3ч",
    "3ч 30 минут",
    "4ч",
    "4ч 30 минут",
    "5ч",
    "5ч 30 минут",
    "6ч",
    "6ч 30 минут",
    "7ч",
    "7ч 30 минут",
    "8ч",
  ];

  const getGenderText = (gender) => genderMap[gender];
  const getDurationText = (duration) => durationMap[duration - 1] || "";

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/services/all");
      if (!response.ok) throw new Error("Ошибка при получении услуг");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError("Ошибка при загрузке услуг");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchServices();
    })();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    if (serviceToDelete === null) return;
    try {
      const response = await fetch(
        `https://api.salon-era.ru/services?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении услуги");
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
    } catch (error) {
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleEdit = (service) => {
    setServiceId(service.id);
    setEditedService(service);
  };

  const groupedServices = services.reduce((acc, service) => {
    const { category, gender } = service;
    if (!acc[gender]) acc[gender] = {};
    if (!acc[gender][category]) acc[gender][category] = [];
    acc[gender][category].push(service);
    return acc;
     
  }, {});

  if (!Object.keys(groupedServices).length) {
    return <p className={styles.message}>Список услуг пуст.</p>;
  }

  const showMessageDeleteService = (id) => {
    setServiceToDelete(id);
    setConfirmDeleteService(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteService = () => {
    setServiceToDelete(null);
    setConfirmDeleteService(false);
    document.body.style.overflow = "scroll";
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["service-list"]}>
      <h1 className={styles.services}>Услуги</h1>
      {Object.keys(groupedServices).map((genderKey, index) => (
        <div key={index}>
          <h3 className={styles.gender}>
            Пол: {genderKey == 1 ? "Мужские услуги" : "Женские услуги"}
          </h3>
          {Object.keys(groupedServices[genderKey]).map((category, index) => (
            <div key={index}>
              <h4 className={styles.category}>Категория:{category}</h4>
              {console.log(category)}
              <ul className={styles["service-list__inner"]}>
                {groupedServices[genderKey][category].map((service, index) => (
                  <li className={styles["service-list__item"]} key={index}>
                    {serviceId === service.id ? (
                      <Modal
                        toggleOpen={toggleOpen}
                        toggleClose={toggleClose}
                        setEditServiceId={setServiceId}
                      >
                        <EditModal
                          setLoading={setLoading}
                          editedService={editedService}
                          setServices={setServices}
                          setServiceId={setServiceId}
                          setEditedService={setEditedService}
                          toggleClose={toggleClose}
                          durationMap={durationMap}
                          service={service}
                        />
                      </Modal>
                    ) : (
                      <div className={styles["service-block"]}>
                        <ServiceBlock
                          service={service}
                          getDurationText={getDurationText}
                          getGenderText={getGenderText}
                        />
                        <div>
                          <BtnBlock
                            className1={styles["edit-service"]}
                            className2={styles["delete-service"]}
                            className4={styles["button-block"]}
                            label1="Редактировать"
                            label2="Удалить услугу"
                            fnc1={() => handleEdit(service)}
                            fnc2={() => showMessageDeleteService(service.id)}
                          />

                          {confirmDeleteService &&
                            serviceToDelete === service.id && (
                              <Modal
                                toggleOpen={toggleOpen}
                                toggleClose={toggleClose}
                                setEditServiceId={closeMessageDeleteService}
                              >
                                <h2 className={styles["question"]}>
                                  Вы действительно хотите удалить услугу ?
                                </h2>
                                <BtnBlock
                                  className1={styles["delete-service"]}
                                  className2={styles["cancel-delete__service"]}
                                  className4={styles["btn-block"]}
                                  label1="Удалить услугу"
                                  label2="Отменить удаления"
                                  fnc1={() => handleDelete(service.id)}
                                  fnc2={closeMessageDeleteService}
                                />
                              </Modal>
                            )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
