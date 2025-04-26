import { useForm } from "react-hook-form";
import { useState } from "react";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const NewsFieldState = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
    },
  });

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addNews, setAddNews] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleOpen = () => setAddNews(true);
  const toggleClose = () => setAddNews(false);

  const formSubmitHandler = async (formValues) => {
    setLoading(true);
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify([
        {
          id: formValues.id,
          name: formValues.name,
          mainText: formValues.mainText,
        },
      ])
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch("https://api.salon-era.ru/news", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Ошибка при добавлении новости");
      }

      setNews((prev) => [...prev, formData]);
      toggleClose();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const deletImagePreview = () => setImagePreview(null);

  return {
    register,
    handleSubmit,
    reset,
    errors,
    news,
    setNews,
    loading,
    addNews,
    toggleOpen,
    toggleClose,
    activeInput,
    setActiveInput,
    imagePreview,
    deletImagePreview,
    selectedFile,
    uploadImage,
    formSubmitHandler,
  };
};
