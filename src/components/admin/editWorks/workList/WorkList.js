import React, { useEffect, useState } from "react";
import Spinner from "../../../spinner/Spinner";
import Modal from "../../../modal/Modal";
import CustomInput from "../../../customInput/CustomInput";
import CustomSelect from "../../../customSelect/CustomSelect";
import { Controller, useForm } from "react-hook-form";

import ImagePreview from "../../../imagePreview/ImagePreview";
import styles from "./workList.module.scss";
import BtnBlock from "../../../btnBlock/BtnBlock";

const WorkList = ({ setWorks, categoryMap, toggleOpen, toggleClose }) => {
  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "1",
    },
  });

  const [worksId, setWorksId] = useState(null);
  const [editedWorks, setEditedWorks] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [groupedWorks, setGroupedWorks] = useState({});
  const [workToDelete, setWorkToDelete] = useState(null);
  const [confirmDeleteWork, setConfirmDeleteWork] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCategpryText = (category) => {
    if (category >= 1 && category <= categoryMap.length) {
      return categoryMap[category - 1];
    } else {
      return "Неизвестная позиция";
    }
  };

  const fetchWorks = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении данных");
      const data = await response.json();
      setWorks(data);

      const filteredData = data.filter((work) => work.category !== "8");

      const grouped = filteredData.reduce((acc, work) => {
        const category = getCategpryText(work.category);
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(work);
        return acc;
      }, {});

      setGroupedWorks(grouped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchWorks();
    })();
  }, []);

  if (!Object.entries(groupedWorks).length) {
    return <p className={styles.message}>Список работ пуст.</p>;
  }

  const handleDelete = async (id) => {
    if (workToDelete === null) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles?id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении работы");
      setWorks((prevWorks) => prevWorks.filter((work) => work.id !== id));
      closeMessageDeleteWork();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      // window.location.reload();
    }
  };

  const showMessageDeleteWork = (id) => {
    setWorkToDelete(id);
    setConfirmDeleteWork(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteWork = () => {
    setConfirmDeleteWork(false);
    setWorkToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedWorks, id };

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...serviceToUpdate,
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setWorks((prevWorks) =>
        prevWorks.map((works) => (works.id === id ? editedWorks : works))
      );
      setWorksId(null);
      setEditedWorks({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const deletImagePreview = () => {
    setImagePreview(null);
  };

  const uploadImage = (event) => {
    const files = event?.target?.files;
    if (!files || files.length === 0) {
      console.error("Файлы не найдены или пусты");
      return;
    }

    const file = files[0];
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Выберите файл изображения.");
    }
  };

  const handleEdit = (slides) => {
    setWorksId(slides.id);
    setEditedWorks(slides);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWorks((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["work-list"]}>
      <h1 className={styles.works}>Работы</h1>
      {Object.entries(groupedWorks).map(
        ([category, worksInCategory], index) => (
          <div key={index}>
            <h3>{category}</h3>
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
                            map={categoryMap}
                            edited={editedWorks.category}
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
                        className1={styles["accept-add__works"]}
                        className2={styles["delete-work"]}
                        className3={styles["cancel-delete__works"]}
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
                          className1={styles["acceptDelete-work"]}
                          className2={styles["cancelDelete-work"]}
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
