import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../use-auth/use-auth";
import { useForm } from "react-hook-form";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import CustomButton from "../../../customButton/CustomButton";
import Spinner from "../../../spinner/Spinner";

import styles from "./servicesList.module.scss";
import CustomSelect from "../../../customSelect/CustomSelect";

const ServiceList = ({
  services,
  setServices,
  setLoading,
  loading,
  toggleCloseSignInForm,
  toggleOpenSignInForm,
}) => {
  const {
    register,
    control,
    reset,
    formState: { errors },
    setError,
  } = useForm({
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
  const [editServiceId, setEditServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [confirmDeleteService, setConfirmDeleteService] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeInput, setActiveInput] = useState("");

  const { gender } = useAuth();

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
  ];

  const getGenderText = (gender) => genderMap[gender];
  const getDurationText = (duration) => durationMap[duration - 1] || "";

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://95.163.84.228:6533/services/all");
      if (!response.ok) throw new Error("Ошибка при получении услуг");
      const data = await response.json();
      setServices(data);
      setFilteredServices(data.filter((service) => service.gender === gender));
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

  useEffect(() => {
    setFilteredServices(
      services.filter((service) => service.gender === gender)
    );
  }, [gender, services]);

  const handleDelete = async (id) => {
    setLoading(true);
    if (serviceToDelete === null) return;
    try {
      const response = await fetch(
        `http://95.163.84.228:6533/services?id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении услуги");
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedService, id };

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
      })
    );
    try {
      const response = await fetch(
        `http://95.163.84.228:6533/services/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Ошибка при сохранении услуги");

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? editedService : service
        )
      );
      setEditServiceId(null);
      setEditedService({});
      toggleCloseSignInForm();
      reset();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (service) => {
    setEditServiceId(service.id);
    setEditedService(service);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedService((prev) => ({ ...prev, [name]: value }));
  };

  const groupedServices = services.reduce((acc, service) => {
    const { category, gender } = service;
    if (!acc[gender]) acc[gender] = {};
    if (!acc[gender][category]) acc[gender][category] = [];
    acc[gender][category].push(service);
    return acc;
  }, {});

  if (!Object.keys(groupedServices).length) {
    return <p className={styles.message}>Нет доступных услуг.</p>;
  }

  const showMessageDeleteEmployee = (id) => {
    setServiceToDelete(id);
    setConfirmDeleteService(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteEmployee = () => {
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
              <h4 className={styles.category}>{category}</h4>
              <ul className={styles["service-list__inner"]}>
                {groupedServices[genderKey][category].map((service, index) => (
                  <li className={styles["service-item"]} key={index}>
                    {editServiceId === service.id ? (
                      <Modal
                        toggleOpenSignInForm={toggleOpenSignInForm}
                        toggleCloseSignInForm={toggleCloseSignInForm}
                        setEditServiceId={setEditServiceId}
                      >
                        <>
                          <h2>Редактировать</h2>
                          <CustomInput
                            label="Введите Название услуги:"
                            error={errors.name}
                            type="text"
                            name="name"
                            value={editedService.name}
                            handleChange={handleChange}
                            isActive={activeInput === "name"}
                            setActiveInput={setActiveInput}
                            {...register("name", {
                              required: "Это поле обязательно.",
                              minLength: {
                                value: 3,
                                message:
                                  "Имя должен содержать минимум 3 символа.",
                              },
                            })}
                          />

                          <CustomInput
                            label="Минимальная цена услуги:"
                            error={errors.priceLow}
                            type="number"
                            name="priceLow"
                            value={editedService.priceLow}
                            handleChange={handleChange}
                            isActive={activeInput === "priceLow"}
                            setActiveInput={setActiveInput}
                            {...register("priceLow", {
                              required: "Это поле обязательно.",
                              minLength: {
                                value: 0,
                                message:
                                  "Минимальная цена должна быть не меньше 0.",
                              },
                            })}
                          />

                          <CustomInput
                            label="Максимальная цена услуги:"
                            name="priceMax"
                            type="number"
                            error={errors.priceMax}
                            value={editedService.priceMax}
                            isActive={activeInput === "priceMax"}
                            setActiveInput={setActiveInput}
                            handleChange={handleChange}
                            min="0"
                            {...register("priceMax", {
                              minLength: {
                                value: 0,
                                message:
                                  "Минимальная цена должна быть не меньше 0.",
                              },
                            })}
                          />

                          <CustomInput
                            label="Категория:"
                            name="category"
                            type="text"
                            error={errors.category}
                            value={editedService.category}
                            isActive={activeInput === "category"}
                            setActiveInput={setActiveInput}
                            handleChange={handleChange}
                            {...register("category", {
                              required: "Это поле обязательно.",
                              minLength: {
                                value: 3,
                                message:
                                  "Название должен содержать минимум 3 символа.",
                              },
                            })}
                          />
                          <CustomInput
                            label="Описание:"
                            name="description"
                            type="text"
                            error={errors.description}
                            value={editedService.description}
                            isActive={activeInput === "description"}
                            setActiveInput={setActiveInput}
                            handleChange={handleChange}
                            {...register("description", {
                              required: "Это поле обязательно.",
                              minLength: {
                                value: 3,
                                message:
                                  "Название должен содержать минимум 3 символа.",
                              },
                            })}
                          />

                          <CustomSelect
                            name="duration"
                            edited={editedService.duration}
                            handleChange={handleChange}
                            map={durationMap}
                          />

                          <CustomInput
                            label="Пол"
                            type="radio"
                            name="gender"
                            value={editedService.gender}
                            handleChange={handleChange}
                            control={control}
                            {...register("gender", {
                              required: "Выберите пол.",
                            })}
                          />
                          <div className={styles["btn-block"]}>
                            <CustomButton
                              label="Сохранить"
                              className={styles["save-service"]}
                              onClick={() => handleSave(service.id)}
                            />
                            <CustomButton
                              label="Отменить"
                              className={styles["cancel"]}
                              onClick={() => setEditServiceId(null)}
                            />
                          </div>
                        </>
                      </Modal>
                    ) : (
                      <>
                        <div>
                          <strong>Название услуги:</strong>
                          <div>{service.name}</div>
                        </div>
                        <div>
                          <strong>Цена:</strong>{" "}
                          <div>
                            {service.priceMax === null
                              ? `${service.priceLow} руб.`
                              : `${service.priceLow} - ${service.priceMax} руб.`}
                          </div>
                        </div>
                        <div>
                          <strong>Описание:</strong>{" "}
                          <div>{service.description}</div>
                        </div>
                        <div>
                          <strong>Продолжительность:</strong>{" "}
                          <div>{getDurationText(service.duration)}</div>
                        </div>
                        <div>
                          <strong>Пол:</strong>
                          <div> {getGenderText(service.gender)}</div>
                        </div>
                        <div className={styles["button-block"]}>
                          <CustomButton
                            label="Редактировать"
                            type="button"
                            className={styles["edit-service"]}
                            onClick={() => handleEdit(service)}
                          />
                          <CustomButton
                            label="Удалить услугу"
                            type="button"
                            className={styles["delete-service"]}
                            onClick={() =>
                              showMessageDeleteEmployee(service.id)
                            }
                          />
                          {confirmDeleteService &&
                            serviceToDelete === service.id && (
                              <div className={styles["modal-overlay"]}>
                                <div className={styles["modal-content"]}>
                                  <h2 className={styles["choose-dateWorkOut"]}>
                                    Вы действительно хотите удалить услугу ?
                                  </h2>

                                  <div className={styles["btn-block"]}>
                                    <CustomButton
                                      className={styles["delete-employee"]}
                                      type="button"
                                      label="Удалить услугу"
                                      onClick={() => handleDelete(service.id)}
                                    />
                                    <CustomButton
                                      className={
                                        styles["cancelDelete-employee"]
                                      }
                                      type="button"
                                      label="Отменить удаления"
                                      onClick={closeMessageDeleteEmployee}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </>
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