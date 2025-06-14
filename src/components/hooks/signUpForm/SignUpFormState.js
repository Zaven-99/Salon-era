import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const useSignUpFormState = ({ toggleClose, toggleShowMessage }) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      login: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "+7",
      image_link: "",
      gender: "",
      policy: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = watch("password");

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  const handleKeyDown = (e) => {
    const value = e.target.value;
    if (value === "+7" && e.key === "Backspace") e.preventDefault();
    if (!/[0-9+]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
  };

  const uploadImage = async (event) => {
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      setSelectedFile(result.compressedFile);
      setImagePreview(result.dataUrl);
    }
  };

  const deletImagePreview = () => setImagePreview(null);

  const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
  const key = CryptoJS.enc.Base64.parse(base64Key);

  const encryptField = (value) =>
    CryptoJS.AES.encrypt(value, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

  // ---- reCAPTCHA v3 ----
  const RECAPTCHA_SITE_KEY = "6Lc4ZFMrAAAAAD8VgxLc7E-1bhw5QArUSREEQE4U";
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
        `${RECAPTCHA_SITE_KEY}`,
        { action: "submit" }
      );

      if (!recaptchaToken) {
        setErrorMessages({
          general: "Пожалуйста, пройдите проверку reCAPTCHA.",
        });
        setLoading(false);
        return;
      }

      const captchaResponse = await fetch(
        "https://api.salon-era.ru/captcha/submit-form",
        {
          method: "POST",
          credentials: "include",

          body: new URLSearchParams({
            "g-recaptcha-response": recaptchaToken,
          }),
        }
      );

      if (!captchaResponse.ok) {
        const text = await captchaResponse.text();
        console.error("Ошибка проверки капчи на сервере:", text);
        throw new Error(`Ошибка при проверке капчи: ${text}`);
      }

      // Формируем данные для регистрации
      const {
        confirmPassword,
        gender,
        patronymic,
        policy: formPolicy,
        ...dataToSend
      } = formValues;

      const formData = new FormData();
      formData.append(
        "clientData",
        JSON.stringify([
          {
            ...dataToSend,
            gender: parseInt(formValues.gender),
            patronymic: "0",
          },
        ])
      );

      if (selectedFile) {
        formData.append("imageData", selectedFile, selectedFile.name);
      }

      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка регистрации:", errorText);
        throw new Error(
          JSON.stringify({ message: errorText, status: response.status })
        );
      }

      const data = await response.json();
      const image_link = data.image_link || imagePreview;

      const userPayload = {
        id: data.id,
        first_name: encryptField(formValues.first_name),
        last_name: encryptField(formValues.last_name),
        login: formValues.login,
        email: encryptField(formValues.email),
        phone: encryptField(formValues.phone),
        gender: parseInt(formValues.gender),
        image_link,
        token: true,
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      dispatch(setUser(userPayload));

      navigate("/");
      toggleClose();
      toggleShowMessage();
    } catch (error) {
      console.error("Ошибка при регистрации:", error);

      try {
        const errorData = JSON.parse(error.message);
        const errorDetails = JSON.parse(errorData.message);
        const errorCode = errorDetails.errorCode;

        if (errorCode === "209") {
          setErrorMessages((prev) => ({
            ...prev,
            login: `Пользователь с логином ${formValues.login} уже существует`,
          }));
        } else if (errorCode === "207") {
          setErrorMessages((prev) => ({
            ...prev,
            phone: `Пользователь с номером ${formValues.phone} уже существует`,
          }));
        } else if (errorCode === "208") {
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
      } catch (parseError) {
        console.error("Ошибка при парсинге ошибки:", parseError);
        setErrorMessages((prev) => ({
          ...prev,
          general: error.message || "Неизвестная ошибка при регистрации",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

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
          script.src = `https://www.google.com/recaptcha/api.js?render=6Lc4ZFMrAAAAAD8VgxLc7E-1bhw5QArUSREEQE4U`;
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showHelpModal,
    toggleHelpModal,
    isDarkMode,
    loading,
    errorMessages,
    handleKeyDown,
    uploadImage,
    deletImagePreview,
    onSubmit,
    setErrorMessages,
    register,
    handleSubmit,
    control,
    errors,
    password,
    imagePreview,
  };
};
