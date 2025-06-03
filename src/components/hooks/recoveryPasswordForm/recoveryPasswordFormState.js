import { useState } from "react";
import CryptoJS from "crypto-js"; // Импортируем CryptoJS
export const RecoverPasswordFormState = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (step === 1) {
        const response = await fetch(
          `https://api.salon-era.ru/clients/recoveryPassword?send=true&email=${data.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: data.email }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          const statusCode = response.status;
          if (statusCode === 404) {
            setErrorMessage(
              "Пользователь с таким email не существует"
            );
          } else {
            throw new Error(`Ошибка: ${errorText}`);
          }
        } else {
          const result = await response.text();
          setSuccessMessage("Письмо для восстановления пароля отправлено.");
          setStep(2);
          setEmail(data.email);
          setVerificationCode(result);
        }
      } else if (step === 2) {
        if (data.code === verificationCode) {
          const formData = new FormData();
          formData.append(
            "clientData",
            JSON.stringify([
              {
                password: data.password,
              },
            ])
          );

          const response = await fetch(
            `https://api.salon-era.ru/clients/changePasswordFromEmail?email=${email}&password=${data.password}`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            setErrorMessage(`Ошибка при изменении пароля: ${errorText}`);
          } else {
            setSuccessMessage("Пароль успешно изменен.");
            setStep(3);
          }
        } else {
          setErrorMessage("Неверный код.");
        }
      }
    } catch (error) {
      setErrorMessage(`Пользователь с ${data.email} не существует`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    step,
    setStep,
    verificationCode,
    setVerificationCode,
    email,
    setEmail,
    onSubmit,
  };
};
