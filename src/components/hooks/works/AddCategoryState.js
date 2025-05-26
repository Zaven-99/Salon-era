import { useState } from "react";
import { useForm } from "react-hook-form";

export const AddCategoryState = (toggleClose, reset) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: formReset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      work: "",
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
          category: "Категория работ",
          type: "Тип работ",
          value: formValues.work,
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/catalogs", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }

      formReset();
      toggleClose();
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return { register, handleSubmit, errors, loading, formSubmitHandler };
};
