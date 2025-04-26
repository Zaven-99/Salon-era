import React from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../modal/Modal";
import BtnBlock from "../../../btnBlock/BtnBlock";
import EditModal from "./editModal/EditModal";
import ServiceBlock from "./serviceBlock/ServiceBlock";
import styles from "./servicesList.module.scss";
import Spinner from "../../../spinner/Spinner";
import { ServiceListState } from "../../../hooks/services/ServiceListState";

const ServiceList = ({
  services,
  setServices,
  toggleClose,
  toggleOpen,
  categories,
  getCategoryTextById,
  dur,
  durationToText,
}) => {
  const { setError } = useForm({
    mode: "onChange",
    defaultValues: {
      id: "",
      name: "",
      category: "",
      description: "",
      duration: "",
      priceLow: null,
      priceMax: null,
      gender: "",
      imageLink: "",
    },
  });

  const {
    serviceId,
    editedService,
    confirmDeleteService,
    serviceToDelete,
    loading,
    setServiceId,
    setEditedService,
    getGenderText,
    handleDelete,
    handleEdit,
    showMessageDeleteService,
    closeMessageDeleteService,
    setLoading,
    groupedServices,
  } = ServiceListState(setError, setServices, services);

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
              <h4 className={styles.category}>
                Категория:{getCategoryTextById(category)}
              </h4>

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
                          service={service}
                          categories={categories}
                          dur={dur}
                        />
                      </Modal>
                    ) : (
                      <div className={styles["service-block"]}>
                        <ServiceBlock
                          service={service}
                          durationToText={durationToText}
                          getGenderText={getGenderText}
                        />
                        <div>
                          <BtnBlock
                            className1={styles["y-btn"]}
                            className2={styles["r-btn"]}
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
                                  className1={styles["g-btn"]}
                                  className2={styles["r-btn"]}
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
