import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const AddEmployeeState = ({ setEmployee, toggleClose }) => {
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
      role: "USER",
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
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const toggleOpenAddPosition = () => setAddPosition(true);
  const toggleCloseAddPosition = () => setAddPosition(false);
  const toggleOpenDeletePosition = () => setDeletePosition(true);
  const toggleCloseDeletePosition = () => setDeletePosition(false);

  const uploadImage = async (event) => {
    console.log("File selected");
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      console.log("Image compressed:", result);
      setSelectedFile(result.compressedFile);
      setImagePreview(result.dataUrl);
    }
  };

  const deletImagePreview = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const fetchCategroy = async () => {
    try {
      const res = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=должность"
      );
      if (!res.ok) throw new Error(`Ошибка http! статус: ${res.status}`);
      const data = await res.json();
      setCategories(data);
    } catch {
      console.log("Ошибка загрузки категорий");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategroy();
  }, []);

  const onSubmit = async (formValues) => {
    const { confirmPassword, ...dataToSend } = formValues;
    const dateWorkIn = new Date(formValues.dateWorkIn);

    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          ...dataToSend,
          dateWorkIn: dateWorkIn.toISOString().slice(0, -1),
          role: "USER",
          arrayTypeWork: formValues.arrayTypeWork,
        },
      ])
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("https://api.salon-era.ru/employees", {
        method: "POST",
        body: formData,
        credentials: "include",
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
    } catch (error) {
      console.error("Ошибка отправки:", error);
      const errorData = JSON.parse(error.message || "{}");
      const errorDetails = JSON.parse(errorData.message || "{}");
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
    } finally {
      setLoading(false);
      deletImagePreview();
      reset();
      // window.location.reload();
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    watch,
    reset,
    password,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    activeInput,
    setActiveInput,
    errorMessages,
    imagePreview,
    selectedFile,
    uploadImage,
    deletImagePreview,
    onSubmit,
    addPosition,
    deletePosition,
    toggleOpenAddPosition,
    toggleCloseAddPosition,
    toggleOpenDeletePosition,
    toggleCloseDeletePosition,
    categories,
    loading,
  };
};
