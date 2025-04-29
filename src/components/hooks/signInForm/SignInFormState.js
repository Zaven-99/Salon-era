import { useState } from "react";
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const toggleHelpModal = () => setShowHelpModal((prev) => !prev);
  const toggleFormSignUp = () => setShowFormSignUp((prev) => !prev);
  const toggleFormRecover = () => setRecoverPasswordForm((prev) => !prev);

  const onSubmit = async (formValues) => {
    try {
      const response = await fetch("https://api.salon-era.ru/clients/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer true",
        },
        body: JSON.stringify(formValues),
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
        clientType: data.clientType,
        token: true,
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));

      if (user.clientType === "admin") {
        navigate("/adminPanel/orders");
      }

      toggleClose();
    } catch (error) {
      const errorData = JSON.parse(error.message);
      const errorDetails = JSON.parse(errorData.message);
      const errorCode = errorDetails.errorCode;
      if (errorCode === "103") {
        setErrorMessages((prev) => ({
          ...prev,
          login: "Неверный логин или пароль",
        }));
      }
    }
  };

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
  };
};
