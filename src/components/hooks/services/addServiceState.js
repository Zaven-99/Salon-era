import { useState } from "react";
import { useForm } from "react-hook-form";

export const AddServiceState = ({
  setServices,
  setLoading,
  toggleClose,
  setErrorMessage,
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
      name: "",
      priceLow: "",
      priceMax: "",
      category: "",
      description: "",
      duration: "",
      gender: "",
    },
  });

  const [activeInput, setActiveInput] = useState(null);
  const [addCategory, setAddCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);

  const toggleOpenAddCategory = () => setAddCategory(true);
  const toggleCloseAddCategory = () => setAddCategory(false);
  const toggleOpenDeleteCategory = () => setDeleteCategory(true);
  const toggleCloseDeleteCategory = () => setDeleteCategory(false);

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          name: formValues.name,
          description: formValues.description,
          category: formValues.category,
          priceLow: parseInt(formValues.priceLow) || 0,
          priceMax: formValues.priceMax ? parseInt(formValues.priceMax) : null,
          duration: formValues.duration,
          gender: parseInt(formValues.gender),
        },
      ])
    );

    try {
      const response = await fetch("https://api.salon-era.ru/services", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении услуги");
      }

      reset();

      setServices((prevServices) => [
        ...prevServices,
        {
          name: formValues.name,
          description: formValues.description,
          category: formValues.category,
          priceLow: parseInt(formValues.priceLow) || 0,
          priceMax: formValues.priceMax ? parseInt(formValues.priceMax) : null,
          duration: parseInt(formValues.duration),
          gender: parseInt(formValues.gender),
        },
      ]);

      toggleClose();
    } catch (error) {
      setLoading(false);
      setErrorMessage(true);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return {
    register,
    handleSubmit,
    control,
    errors,
    activeInput,
    setActiveInput,
    addCategory,
    deleteCategory,
    toggleOpenAddCategory,
    toggleCloseAddCategory,
    toggleOpenDeleteCategory,
    toggleCloseDeleteCategory,
    formSubmitHandler,
  };
};

 
