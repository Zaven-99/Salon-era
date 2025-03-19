import React from "react";
import { useForm } from "react-hook-form";
import CustomInput from '../../../../../customInput/CustomInput';
import BtnBlock from '../../../../../btnBlock/BtnBlock';
 
import styles from './editForm.module.scss'

const EditForm = ({
  setLoading,
  editedClient,
  setEditedClient,
  setClientId,
  activeInput,
  setActiveInput,
  handleKeyDown,
  client,
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  });

  const handleSave = async (id) => {
    setLoading(true);
    const formattedDate = `${editedClient.dateWorkIn}`;

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        ...editedClient,
        dateWorkIn: formattedDate,
        id,
      })
    );

    try {
      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setClientId(null);
      setEditedClient({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h2>Редактировать</h2>
      <CustomInput
        label="Введите имя:"
        error={errors.firstName}
        type="text"
        name="firstName"
        value={editedClient.firstName}
        handleChange={handleChange}
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
        value={editedClient.lastName}
        handleChange={handleChange}
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
      <CustomInput
        label="Введите почту:"
        name="email"
        type="email"
        error={errors.email}
        value={editedClient.email}
        handleChange={handleChange}
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
      <CustomInput
        label="Введите номер телефона:"
        error={errors.phone}
        name="phone"
        type="tel"
        value={editedClient.phone}
        handleChange={handleChange}
        isActive={activeInput === "phone"}
        setActiveInput={setActiveInput}
        onKeyDown={handleKeyDown}
        {...register("phone", {
          required: "Это поле обязательно",
          pattern: {
            value: /^\+7\d{10}$/,
            message: "Номер телефона должен содержать 10 цифр",
          },
        })}
      />

      <CustomInput
        label="Пол"
        type="radio"
        name="gender"
        value={editedClient.gender}
        handleChange={handleChange}
        control={control}
        {...register("gender", {
          required: "Выберите пол.",
        })}
      />

      <BtnBlock
        className1={styles["save-client"]}
        className2={styles["cancel"]}
        className4={styles["btn-block"]}
        label1="Сохранить изменения"
        label2="Отменить"
        fnc1={() => handleSave(client.id)}
        fnc2={() => setClientId(null)}
      />
    </div>
  );
};

export default EditForm;
