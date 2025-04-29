import { useState } from "react";
import { useForm } from "react-hook-form";

export const SignUpBlockState = ({
  setSuccesSignUp,
  // setLoading,
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
      phone: "",
      gender: "",
    },
  });

  const [errorMessages, setErrorMessages] = useState(false);
  const [loading,setLoading] = useState(false)
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
          password: "Password123.",
          email: generateRandomEmail(),
          gender: parseInt(formValues.gender),
          patronymic: "0",
        },
      ])
    );

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
      } else {
        setLoading(true);
        const responseData = await response.json();
        setClient(responseData);
      }

      setSuccesSignUp(true);
      reset();
      toggleCloseOfferModal();
    } catch (error) {
      const errorData = JSON.parse(error.message);
      const status = errorData.status;

      if (status === 442) {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      }
    } finally {
      setSuccesSignUp(false);
      setLoading(false);
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
