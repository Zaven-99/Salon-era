import { useState } from "react";
import { useForm } from "react-hook-form";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const EditHeaderSlidesState = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      mainText: "",
    },
  });

  const [slides, setSlides] = useState([]);
  const [addSlides, setAddSlides] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  const toggleOpen = () => setAddSlides(true);
  const toggleClose = () => setAddSlides(false);
  const deletImagePreview = () => setImagePreview(null);

  const uploadImage = async (event) => {
    console.log("File selected");
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      console.log("Image compressed:", result);
      setSelectedFile(result.compressedFile);
      setImagePreview(result.dataUrl);
    }
  };

  const formSubmitHandler = async (formValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "clientData",
      JSON.stringify([
        {
          name: formValues.name,
          category: "8",
        },
      ])
    );

    if (!selectedFile) {
      setErrorMessages("Добавьте картинку!");
      setLoading(false);
      return;
    }

    formData.append("imageData", selectedFile, selectedFile.name);

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }

      setSlides((prevSlides) => [...prevSlides, formData]);
      toggleClose();
      reset();
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    reset,
    errors,
    slides,
    setSlides,
    addSlides,
    toggleOpen,
    toggleClose,
    imagePreview,
    deletImagePreview,
    selectedFile,
    uploadImage,
    formSubmitHandler,
    loading,
    activeInput,
    setActiveInput,
    errorMessages,
  };
};
