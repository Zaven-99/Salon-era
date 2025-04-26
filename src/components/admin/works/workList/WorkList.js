import React from "react";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import CustomSelect from "../../../customSelect/CustomSelect";
import { Controller, useForm } from "react-hook-form";
import { WorkListState } from "../../../hooks/works/WorkListState";

import ImagePreview from "../../../imagePreview/ImagePreview";
import styles from "./workList.module.scss";
import BtnBlock from "../../../btnBlock/BtnBlock";

const WorkList = ({ setWorks, categories, toggleOpen, toggleClose }) => {
  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "1",
    },
  });

  const {
    worksId,
    setWorksId,
    editedWorks,
    activeInput,
    setActiveInput,
    imagePreview,
    groupedWorks,
    workToDelete,
    confirmDeleteWork,
    loading,
    handleDelete,
    showMessageDeleteWork,
    closeMessageDeleteWork,
    handleSave,
    deletImagePreview,
    uploadImage,
    handleEdit,
    handleChange,
    getCategoryName,
  } = WorkListState(setWorks);

  

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["work-list"]}>
      <h1 className={styles.works}>Работы</h1>
      {Object.entries(groupedWorks).map(
        ([categoryId, worksInCategory], index) => (
          <div key={index}>
            <h3>{getCategoryName(categoryId)}</h3>
            <ul className={styles["work-list__inner"]}>
              {worksInCategory.map((work, index) => (
                <li
                  onClick={() => handleEdit(work)}
                  key={index}
                  className={styles["work-list__item"]}
                >
                  {worksId === work.id ? (
                    <Modal
                      toggleOpen={toggleOpen}
                      toggleClose={toggleClose}
                      setWorksId={setWorksId}
                    >
                      <h2>Редактировать</h2>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            name="category"
                            control={control}
                            map={categories}
                            edited={editedWorks.category}
                            valueType="id"
                            handleChange={handleChange}
                          />
                        )}
                      />

                      <ImagePreview
                        deletImagePreview={deletImagePreview}
                        imagePreview={imagePreview}
                      />

                      <CustomInput
                        type="file"
                        name="imageLink"
                        placeholder="Выберите изображение"
                        isActive={activeInput === "imageLink"}
                        setActiveInput={setActiveInput}
                        onChange={uploadImage}
                      />

                      <BtnBlock
                        className1={styles["g-btn"]}
                        className2={styles["r-btn"]}
                        className3={styles["r-btn"]}
                        className4={styles["btn-block"]}
                        label1="Сохранить"
                        label2="Удалить работу"
                        label3="Отменить"
                        fnc1={() => handleSave(work.id)}
                        fnc2={() => showMessageDeleteWork(work.id)}
                        fnc3={() => setWorksId(null)}
                        showThirdButton={true}
                      />
                    </Modal>
                  ) : (
                    <>
                      <div>
                        <img src={work.imageLink} alt="" />
                      </div>
                    </>
                  )}

                  <div>
                    {confirmDeleteWork && workToDelete === work.id && (
                      <Modal
                        toggleOpen={toggleOpen}
                        toggleClose={toggleClose}
                        setWorksId={closeMessageDeleteWork}
                      >
                        <h2 className={styles.question}>
                          Вы действительно хотите удалить работу?
                        </h2>
                        <BtnBlock
                          className1={styles["g-btn"]}
                          className2={styles["r-btn"]}
                          className4={styles["btn-block"]}
                          label1="Удалить работу"
                          label2="Отменить удаление"
                          fnc1={() => handleDelete(work.id)}
                          fnc2={closeMessageDeleteWork}
                        />
                      </Modal>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default WorkList;
