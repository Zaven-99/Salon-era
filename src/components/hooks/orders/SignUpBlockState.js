import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";

export const SignUpBlockState = ({
  setSuccesSignUp,
  setClient,
  setOfferModal,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
    },
  });

  const [errorMessages, setErrorMessages] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const generateRandomEmail = () => {
    const domains = ["gmail.com", "yahoo.com", "mail.ru", "outlook.com"];
    const username = generateRandomString(8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  };

  const onSubmit = async (formValues) => {
    const { gender, patronymic, policy, ...dataToSend } = formValues;

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          ...dataToSend,
          login: generateRandomString(5),
          password: "Password123..",
          email: generateRandomEmail(),
          gender: parseInt(formValues.gender),
          patronymic: "0",
        },
      ])
    );

    try {
      setLoading(true);

      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          JSON.stringify({ message: data, status: response.status })
        );
      }

      setClient(data);

      const userPayload = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.login,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        token: true,
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      dispatch(setUser(userPayload));

      setSuccesSignUp(true);
      reset();
      toggleCloseOfferModal();
    } catch (error) {
      let status = null;
      let raw = error.message;

      try {
        const parsed = JSON.parse(error.message);
        status = parsed.status;
      } catch {
        console.error("Ошибка запроса:", error.message);
      }

      if (status === 442) {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          general: "Ошибка регистрации. Попробуйте позже.",
        }));
      }
    } finally {
      setLoading(false);
      setSuccesSignUp(false);
    }
  };

  const toggleCloseOfferModal = () => {
    setOfferModal(false);
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    errorMessages,
    setErrorMessages,
    onSubmit,
    toggleCloseOfferModal,
    loading,
  };
};
