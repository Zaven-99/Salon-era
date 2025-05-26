// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { setUser } from "../../../store/slices/userSlice";

// export const SignInFormState = ({ toggleClose }) => {
//   const [showFormSignUp, setShowFormSignUp] = useState(false);
//   const [showRecoverPasswordForm, setRecoverPasswordForm] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showHelpModal, setShowHelpModal] = useState(false);
//   const [errorMessages, setErrorMessages] = useState({});
//   const [activeInput, setActiveInput] = useState("");
//   const [adminCheck, setAdminCheck] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm({
//     mode: "onChange",
//     defaultValues: {
//       login: "",
//       password: "",
//     },
//   });

//   const toggleHelpModal = () => setShowHelpModal((prev) => !prev);
//   const toggleFormSignUp = () => setShowFormSignUp((prev) => !prev);
//   const toggleFormRecover = () => setRecoverPasswordForm((prev) => !prev);

//   const onSubmit = async (formValues) => {
//     try {
//       const isAdmin = adminCheck;
//       const url = adminCheck
//         ? "https://api.salon-era.ru/employees/auth"
//         : "https://api.salon-era.ru/clients/auth";

//       const requestBody = isAdmin
//         ? {
//             login: formValues.login,
//             password: formValues.password,
//           }
//         : {
//             login: formValues.login,
//             password: formValues.password,
//           };

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         const statusCode = response.status;
//         throw new Error(
//           JSON.stringify({ message: errorText, status: statusCode })
//         );
//       }

//       const data = await response.json();

//       const user = {
//         id: data.id,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         login: data.login,
//         phone: data.phone,
//         email: data.email,
//         gender: data.gender,
//         imageLink: data.imageLink,
//         token: true,
//         ...(isAdmin ? { role: data.role } : {}),
//       };

//       localStorage.setItem("user", JSON.stringify(user));
//       dispatch(setUser(user));

//       if (user.login === "admin") {
//         navigate("/adminPanel/orders");
//       }

//       toggleClose();
//     } catch (error) {
//       try {
//         const errorData = JSON.parse(error.message);
//         const errorDetails = JSON.parse(errorData.message);
//         const errorCode = errorDetails.errorCode;

//         if (errorCode === "103") {
//           setErrorMessages((prev) => ({
//             ...prev,
//             login: "Неверный логин или пароль",
//           }));
//         }
//       } catch {
//         console.error("Ошибка авторизации:", error);
//       }
//     }
//   };

//   return {
//     showFormSignUp,
//     setShowFormSignUp,
//     showRecoverPasswordForm,
//     setRecoverPasswordForm,
//     showPassword,
//     setShowPassword,
//     loading,
//     showHelpModal,
//     setShowHelpModal,
//     errorMessages,
//     setErrorMessages,
//     activeInput,
//     setActiveInput,
//     toggleHelpModal,
//     toggleFormSignUp,
//     toggleFormRecover,
//     handleSubmit,
//     register,
//     errors,
//     onSubmit,
//     adminCheck,
//     setAdminCheck,
//     setValue,
//   };
// };


import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setUser } from "../../../store/slices/userSlice";

export const SignInFormState = ({ toggleClose }) => {
  const [showFormSignUp, setShowFormSignUp] = useState(false);
  const [showRecoverPasswordForm, setRecoverPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [activeInput, setActiveInput] = useState("");
  const [adminCheck, setAdminCheck] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // ---- reCAPTCHA v3 ----
  const RECAPTCHA_SITE_KEY = "6LdB2UkrAAAAAP_7ThCEqgupd2DSaZL2xNk6bDt2";
  useEffect(() => {
    const scriptId = "recaptcha-v3-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const loadRecaptchaScript = () => {
    return new Promise((resolve) => {
      if (window.grecaptcha) {
        resolve();
      } else {
        const scriptId = "recaptcha-v3-script";
        if (!document.getElementById(scriptId)) {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
          script.async = true;
          script.onload = () => resolve();
          document.body.appendChild(script);
        } else {
          const checkInterval = setInterval(() => {
            if (window.grecaptcha) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        }
      }
    });
  };

  const onSubmit = async (formValues) => {
   
    setErrorMessages({});

    try {
      await loadRecaptchaScript();

      if (!window.grecaptcha || !window.grecaptcha.execute) {
        setErrorMessages({
          general: "Не удалось загрузить reCAPTCHA. Попробуйте позже.",
        });
        setLoading(false);
        return;
      }

      const recaptchaToken = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        {
          action: "submit",
        }
      );

      if (!recaptchaToken) {
        setErrorMessages({
          general: "Пожалуйста, пройдите проверку reCAPTCHA.",
        });
        setLoading(false);
        return;
      }

      // Отправляем токен на сервер для проверки
      const captchaResponse = await fetch(
        "https://api.salon-era.ru/captcha/submit-form",
        {
          method: "POST",
          body: new URLSearchParams({
            "g-recaptcha-response": recaptchaToken,
          }),
        }
      );

      if (!captchaResponse.ok) {
        const text = await captchaResponse.text();
        throw new Error(`Ошибка при проверке капчи: ${text}`);
      }

      // Далее выполняем обычную авторизацию
      const isAdmin = adminCheck;
      const url = isAdmin
        ? "https://api.salon-era.ru/employees/auth"
        : "https://api.salon-era.ru/clients/auth";

      const requestBody = {
        login: formValues.login,
        password: formValues.password,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();

      const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        login: data.login,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        imageLink: data.imageLink,
        token: true,
        ...(isAdmin ? { role: data.role } : {}),
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));

      if (user.login === "admin") {
        navigate("/adminPanel/orders");
      }

      toggleClose();
    } catch (error) {
      try {
        const errorData = JSON.parse(error.message);
        const errorDetails = JSON.parse(errorData.message);
        const errorCode = errorDetails.errorCode;

        if (errorCode === "103") {
          setErrorMessages((prev) => ({
            ...prev,
            login: "Неверный логин или пароль",
          }));
        } else {
          setErrorMessages((prev) => ({
            ...prev,
            general: "Ошибка авторизации. Попробуйте позже.",
          }));
        }
      } catch {
        console.error("Ошибка авторизации:", error);
        setErrorMessages((prev) => ({
          ...prev,
          general: error.message || "Неизвестная ошибка при авторизации",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleHelpModal = () => setShowHelpModal((prev) => !prev);
  const toggleFormSignUp = () => setShowFormSignUp((prev) => !prev);
  const toggleFormRecover = () => setRecoverPasswordForm((prev) => !prev);

  return {
    showFormSignUp,
    setShowFormSignUp,
    showRecoverPasswordForm,
    setRecoverPasswordForm,
    showPassword,
    setShowPassword,
    loading,
    showHelpModal,
    setShowHelpModal,
    errorMessages,
    setErrorMessages,
    activeInput,
    setActiveInput,
    toggleHelpModal,
    toggleFormSignUp,
    toggleFormRecover,
    handleSubmit,
    register,
    errors,
    onSubmit,
    adminCheck,
    setAdminCheck,
    setValue,
  };
};
