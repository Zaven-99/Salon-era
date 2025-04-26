import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const SignUpFormState = ({
  toggleClose,
  toggleShowMessage,
  
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [policy, setPolicy] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  const handlePolicyChange = () => setPolicy((prev) => !prev);

  const handleKeyDown = (e) => {
    const value = e.target.value;
    if (value === "+7" && e.key === "Backspace") e.preventDefault();
    if (!/[0-9+]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
  };

  const uploadImage = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Выберите файл изображения.");
    }
  };

  const deletImagePreview = () => setImagePreview(null);

  const onSubmit = async (formValues) => {
    const {
      confirmPassword,
      gender,
      patronymic,
      policy: formPolicy,
      ...dataToSend
    } = formValues;

    if (!policy) {
      setLoading(false);
      return;
    }

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

    try {
      const response = await fetch("https://api.salon-era.ru/clients", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          JSON.stringify({ message: errorText, status: response.status })
        );
      }

      setLoading(true);
      const data = await response.json();

      const imageLink = data.imageLink || imagePreview;
      const userPayload = {
        id: data.id,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        login: formValues.login,
        email: formValues.email,
        phone: formValues.phone,
        gender: parseInt(formValues.gender),
        imageLink,
        token: true,
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      dispatch(setUser(userPayload));

      navigate("/");
      toggleClose();
      toggleShowMessage();
    } catch (error) {
      const errorData = JSON.parse(error.message);
      const errorDetails = JSON.parse(errorData.message);
      const errorCode = errorDetails.errorCode;

      if (errorCode === "204") {
        setErrorMessages((prev) => ({
          ...prev,
          login: `Пользователь с логином ${formValues.login} уже существует`,
        }));
      } else if (errorCode === "306") {
        setErrorMessages((prev) => ({
          ...prev,
          phone: `Пользователь с номером ${formValues.phone} уже существует`,
        }));
      } else if (errorCode === "307") {
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
    }
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
    policy,
    handlePolicyChange,
    handleKeyDown,
    uploadImage,
    deletImagePreview,
    onSubmit,
    setErrorMessages,
  };
};
