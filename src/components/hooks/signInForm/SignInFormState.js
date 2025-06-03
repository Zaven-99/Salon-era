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

  async function getUserIP() {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (e) {
      console.error("Ошибка получения IP:", e);
      return null;
    }
  }
  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Ошибка геолокации:", err.message);
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  };

  async function reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) throw new Error("Ошибка геокодирования");
      const data = await response.json();
      return data.display_name || null;
    } catch (e) {
      console.error("Ошибка обратного геокодирования:", e);
      return null;
    }
  }

  // ---- reCAPTCHA v3 ----
  // const RECAPTCHA_SITE_KEY = "6Lc4ZFMrAAAAAD8VgxLc7E-1bhw5QArUSREEQE4U";

  // useEffect(() => {
  //   const scriptId = "recaptcha-v3-script";
  //   if (!document.getElementById(scriptId)) {
  //     const script = document.createElement("script");
  //     script.id = scriptId;
  //     script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }
  // }, []);

  // const loadRecaptchaScript = () => {
  //   return new Promise((resolve) => {
  //     if (window.grecaptcha) {
  //       resolve();
  //     } else {
  //       const checkInterval = setInterval(() => {
  //         if (window.grecaptcha) {
  //           clearInterval(checkInterval);
  //           resolve();
  //         }
  //       }, 100);
  //     }
  //   });
  // };

  const onSubmit = async (formValues) => {
    // const ip = await getUserIP();
    // const location = await getUserLocation();
    setErrorMessages({});

    // let address = null;
    // if (location) {
    //   address = await reverseGeocode(location.latitude, location.longitude);
    // }

    try {
      // await loadRecaptchaScript();

      // if (!window.grecaptcha || !window.grecaptcha.execute) {
      //   setErrorMessages({
      //     general: "Не удалось загрузить reCAPTCHA. Попробуйте позже.",
      //   });
      //   return;
      // }

      // const recaptchaToken = await window.grecaptcha.execute(
      //   RECAPTCHA_SITE_KEY,
      //   {
      //     action: "submit",
      //   }
      // );

      // if (!recaptchaToken) {
      //   setErrorMessages({
      //     general: "Пожалуйста, пройдите проверку reCAPTCHA.",
      //   });
      //   return;
      // }

      // const captchaResponse = await fetch(
      //   "https://api.salon-era.ru/captcha/submit-form",
      //   {
      //     method: "POST",
      //     body: new URLSearchParams({
      //       // "g-recaptcha-response": recaptchaToken,
      //     }),
      //   }
      // );

      // if (!captchaResponse.ok) {
      //   const text = await captchaResponse.text();
      //   throw new Error(`Ошибка при проверке капчи: ${text}`);
      // }

      const url = "https://api.salon-era.ru/clients/auth";

      const requestBody = {
        login: formValues.login,
        password: formValues.password,
        // location: {
        //   latitude: location?.latitude || null,
        //   longitude: location?.longitude || null,
        //   address: address,
        // },
        // ip: ip || null,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "X-User-IP": ip || "",
          // "X-User-Lat": location?.latitude?.toString() || "",
          // "X-User-Lon": location?.longitude?.toString() || "",
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
        role: "USER",
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));

      toggleClose();
    } catch (error) {
      try {
        const errorData = JSON.parse(error.message);
        const errorDetails = JSON.parse(errorData.message);
        const errorCode = errorDetails.errorCode;

        if (errorCode === "100") {
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
