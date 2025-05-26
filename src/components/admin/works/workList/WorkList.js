import React from "react";
import Modal from "../../../modal/Modal";
import CustomSelect from "../../../customSelect/CustomSelect";
import { Controller, useForm } from "react-hook-form";
import { WorkListState } from "../../../hooks/works/WorkListState";
import ImagePreview from "../../../uploadImage/imagePreview/ImagePreview";
import BtnBlock from "../../../btnBlock/BtnBlock";
import GenericSkeleton from "../../../../utils/Skeleton";

import styles from "./workList.module.scss";
import UploadImage from "../../../uploadImage/UploadImage";

const WorkList = ({ setWorks, categories, toggleOpen, toggleClose, works }) => {
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
    return (
      <GenericSkeleton
        headerCount={1}
        headerWidths={["50%", "30%"]}
        itemCount={10}
        itemWidth="100%"
        itemHeight={50}
      />
    );
  }

  if (!works.length) {
    return <p className={styles.message}>Список работ пуст.</p>;
  }

  return (
    <div className={styles["work-list"]}>
      <h1 className={styles.works}>Работы</h1>
      {Object.entries(groupedWorks).map(
        ([categoryId, worksInCategory], index) => (
          <div className={styles.wrapper} key={index}>
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

                      <UploadImage onChange={uploadImage} />

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
