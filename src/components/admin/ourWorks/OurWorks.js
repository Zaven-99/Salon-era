import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./ourWorks.module.scss";
import CustomButton from "../../customButton/CustomButton";
import Modal from "../../modal/Modal";
import CustomInput from "../../customInput/CustomInput";
import ImagePreview from "../../imagePreview/ImagePreview";
import WorkList from "./workList/WorkList";
import CustomSelect from "../../customSelect/CustomSelect";
import Spinner from "../../spinner/Spinner";

const OurWorks = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "1",
    },
  });

  const [works, setWorks] = useState([]);
  const [addWorks, setAddWorks] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categoryMap = [
    "Мужские стрижки",
    "Женские стрижки",
    "Женские прически",
    "Окрашивание волос",
    "Маникюр",
    "Ресницы",
    "Брови",
  ];

  const toggleOpenSignInForm = () => {
    setAddWorks(true);
  };
  const toggleCloseSignInForm = () => {
    setAddWorks(false);
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

  const onSubmit = async (formValues) => {
    setLoading(true);

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        name: formValues.workName,
        category: formValues.category,
      })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("http://95.163.84.228:6533/stockfiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.statusText}`);
      }

      setWorks((prevWorks) => [...prevWorks, formData]);
      toggleCloseSignInForm();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles["our-works"]}>
      <CustomButton
        className={styles['add-work']}
        label="Добавить работу"
        onClick={toggleOpenSignInForm}
      />
      <h1>Работы</h1>
      {!works.length > 0 && (
        <p className={styles["message"]}>Добавьте работы!</p>
      )}
      {addWorks && (
        <Modal
          toggleOpenSignInForm={toggleOpenSignInForm}
          toggleCloseSignInForm={toggleCloseSignInForm}
        >
          <h2>Добавить работу</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  name="category"
                  control={control}
                  map={categoryMap}
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
            <CustomButton
              className={styles["accept-add__work"]}
              type="submit"
              label="Добавить работу"
            />
          </form>
        </Modal>
      )}

      <WorkList setWorks={setWorks} works={works} categoryMap={categoryMap} />
    </div>
  );
};

export default OurWorks;
