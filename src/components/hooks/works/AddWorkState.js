import { useState } from "react";
import { useForm } from "react-hook-form";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const AddWorkState = (categories, setWorks, toggleClose) => {
  const { handleSubmit, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "",
    },
  });

  const [activeInput, setActiveInput] = useState("");
  const [addCategory, setAddCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleOpenAddCategory = () => {
    setAddCategory(true);
  };

  const toggleCloseAddCategory = () => {
    setAddCategory(false);
  };

  const toggleOpenDeleteCategory = () => {
    setDeleteCategory(true);
  };

  const toggleCloseDeleteCategory = () => {
    setDeleteCategory(false);
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          name: formValues.workName,
          category: formValues.category,
        },
      ])
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.statusText}`);
      }

      setWorks((prevWorks) => [...prevWorks, formData]);
      toggleClose();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

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
  };

  return {
    handleSubmit,
    control,
    activeInput,
    setActiveInput,
    addCategory,
    deleteCategory,
    imagePreview,
    selectedFile,
    loading,
    toggleOpenAddCategory,
    toggleCloseAddCategory,
    toggleOpenDeleteCategory,
    toggleCloseDeleteCategory,
    formSubmitHandler,
    uploadImage,
    deletImagePreview,
  };
};
