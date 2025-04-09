import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import CustomButton from "../../../customButton/CustomButton";
import CustomInput from "../../../customInput/CustomInput";
import ImagePreview from "../../../imagePreview/ImagePreview";
import CustomSelect from "../../../customSelect/CustomSelect";

import styles from "./addEmployee.module.scss";
import Modal from "../../../modal/Modal";
import AddPosition from "./addPosition/AddPosition";
import Spinner from "../../../spinner/Spinner";
import DeletePosition from "./deletePosition/DeletePosition";

const AddEmployee = ({
  setLoading,
  setEmployee,
  toggleClose,
  toggleHelpModal,
  showHelpModal,
  handleKeyDown,
  positionOptions,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      position: "1",
      dateWorkIn: "",
      gender: "",
      imageLink: "",
      arrayTypeWork: [],
      clientType: "employee",
    },
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addPosition, setAddPosition] = useState(false);
  const [deletePosition, setDeletePosition] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleOpenAddPosition = () => {
    setAddPosition(true);
  };
  const toggleCloseAddPosition = () => {
    setAddPosition(false);
  };
  const toggleOpenDeletePosition = () => {
    setDeletePosition(true);
  };
  const toggleCloseDeletePosition = () => {
    setDeletePosition(false);
  };

  const password = watch("password");

  const onSubmit = async (formValues) => {
    const { confirmPassword, ...dataToSend } = formValues;
    const dateWorkIn = new Date(formValues.dateWorkIn);

    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          ...dataToSend,
          dateWorkIn: dateWorkIn.toISOString().slice(0, -1),
          clientType: "employee",
          arrayTypeWork: formValues.arrayTypeWork,
        },
      ])
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }
    try {
      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      setEmployee((prev) => [...prev, dataToSend]);
      toggleClose();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);

      const errorData = JSON.parse(error.message);
      const status = errorData.status;

      if (status === 441) {
        setErrorMessages((prev) => ({
          ...prev,
          login: `Пользователь с логином ${formValues.login} уже существует`,
        }));
      } else if (status === 442) {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      } else if (status === 443) {
        setErrorMessages((prev) => ({
          ...prev,
          email: `Клиент с указанным почтовым адресом ${formValues.email} уже существует`,
        }));
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          general:
            "Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.",
        }));
      }
    } finally {
      setLoading(false);
      deletImagePreview();
    }
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

  const deletImagePreview = () => {
    setImagePreview(null);
  };

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

  const categoryOptions = categories.filter(
    (item) => item.category === "Должность"
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <form
      className={styles["employee-field__inner"]}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CustomInput
        label="Введите имя:"
        error={errors.firstName}
        type="text"
        name="firstName"
        isActive={activeInput === "firstName"}
        setActiveInput={setActiveInput}
        {...register("firstName", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Имя должен содержать минимум 3 символа.",
          },
        })}
      />

      <CustomInput
        label="Введите фамилию:"
        error={errors.lastName}
        type="text"
        name="lastName"
        isActive={activeInput === "lastName"}
        setActiveInput={setActiveInput}
        {...register("lastName", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Фамилия должен содержать минимум 3 символа.",
          },
        })}
      />
      <p className={styles["error-message"]}>{errorMessages.login}</p>

      <CustomInput
        label="Введите логин:"
        error={errors.login}
        type="text"
        name="login"
        isActive={activeInput === "login"}
        setActiveInput={setActiveInput}
        {...register("login", {
          required: "Это поле обязательно.",
          minLength: {
            value: 3,
            message: "Логин должен содержать минимум 3 символа.",
          },
          maxLength: {
            value: 20,
            message: "Логин не должен превышать 20 символов.",
          },
        })}
      />

      <CustomInput
        label="Введите пароль:"
        show={() => setShowPassword((prev) => !prev)}
        showPassword={showPassword}
        error={errors.password}
        toggleHelpModal={toggleHelpModal}
        showHelpModal={showHelpModal}
        isActive={activeInput === "password"}
        setActiveInput={setActiveInput}
        autoComplete="new-password"
        {...register("password", {
          required: "Это поле обязательно.",
          minLength: {
            value: 8,
            message: "Пароль должен содержать минимум 8 символов.",
          },
          validate: {
            hasUpperCase: (value) =>
              /[A-Z]/.test(value) ||
              "Пароль должен содержать хотя бы одну заглавную букву.",
            hasLowerCase: (value) =>
              /[a-z]/.test(value) ||
              "Пароль должен содержать хотя бы одну строчную букву.",
            hasNumber: (value) =>
              /\d/.test(value) || "Пароль должен содержать хотя бы одну цифру.",
            hasSpecialChar: (value) =>
              /[!@#$%^&*._-]/.test(value) ||
              "Пароль должен содержать хотя бы один специальный символ: ! @ # $ % ^ & * . - _",
            hasCyrillic: (value) =>
              !/[а-яА-ЯЁё]/.test(value) ||
              "Пароль не должен содержать кириллические символы.",
          },
        })}
      />

      <CustomInput
        label="Подтвердите пароль:"
        show={() => setShowConfirmPassword((prev) => !prev)}
        showConfirmPassword={showConfirmPassword}
        error={errors.confirmPassword}
        isActive={activeInput === "confirmPassword"}
        setActiveInput={setActiveInput}
        {...register("confirmPassword", {
          required: "Это поле обязательно.",
          validate: (value) => value === password || "Пароли не совпадают",
        })}
      />
      <p className={styles["error-message"]}>{errorMessages.email}</p>

      <CustomInput
        label="Введите почту:"
        name="email"
        type="email"
        error={errors.email}
        isActive={activeInput === "email"}
        setActiveInput={setActiveInput}
        {...register("email", {
          required: "Это поле обязательно",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Введите корректный адрес электронной почты",
          },
        })}
      />
      <p className={styles["error-message"]}>{errorMessages.phone}</p>

      <CustomInput
        label="Введите номер телефона:"
        error={errors.phone}
        name="phone"
        type="tel"
        isActive={activeInput === "phone"}
        setActiveInput={setActiveInput}
        onKeyDown={handleKeyDown}
        {...register("phone", {
          required: "Это поле обязательно",
          pattern: {
            value: /^\+7\d{10}$/,
            message: "Неккоректный номер телефона",
          },
        })}
      />
      <CustomInput
        label="Укажите дату трудоустройства"
        type="date"
        error={errors.dateWorkIn}
        name="dateWorkIn"
        isActive={activeInput === "dateWorkIn"}
        setActiveInput={setActiveInput}
        {...register("dateWorkIn", {
          required: "Это поле обязательно",
        })}
      />

      <Controller
        name="position"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            name="position"
            control={control}
            map={positionOptions}
            valueType="id"
            error={errors.position}
          />
        )}
      />
      <div className={styles["btn-block"]}>
        <CustomButton
          label="Добавить должность"
          onClick={toggleOpenAddPosition}
          className={styles["g-btn"]}
        />
        <CustomButton
          label="Удалить должность"
          onClick={toggleOpenDeletePosition}
          className={styles["r-btn"]}
        />
      </div>

      {addPosition && (
        <Modal
          toggleOpen={toggleOpenAddPosition}
          toggleClose={toggleCloseAddPosition}
        >
          <AddPosition
            toggleClose={toggleCloseAddPosition}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        </Modal>
      )}

      {deletePosition && (
        <Modal
          toggleOpen={toggleOpenDeletePosition}
          toggleClose={toggleCloseDeletePosition}
        >
          <DeletePosition toggleClose={toggleCloseDeletePosition} />
        </Modal>
      )}

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
      <h5 className={styles["choose-category"]}>
        Выберите категорию услуг для мастера
      </h5>
      <div className={styles["block-checkbox"]}>
        {categoryOptions.map((category) => (
          <div key={category.id}>
            <label className={styles.check}>
              <input
                name="arrayTypeWork"
                type="checkbox"
                value={category.id}
                {...register("arrayTypeWork")}
              />
              {category.value}
            </label>
          </div>
        ))}
      </div>

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        control={control}
        {...register("gender", { required: "Выберите пол." })}
      />
      <CustomButton
        className={styles["gr-btn"]}
        type="submit"
        label="Добавить сотрудника"
      />
    </form>
  );
};

export default AddEmployee;
