import { useForm } from "react-hook-form";
import { useState } from "react";

export const AddPositionState = ({ toggleClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      position: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          category: "Должность",
          value: formValues.position,
          type: "Типы должностей",
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/catalogs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }

      reset();
      toggleClose();
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return {
    register,
    handleSubmit,
    formSubmitHandler,
    errors,
    loading,
  };
};
