import { useEffect, useState } from "react";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const HeaderSlidesListState = (setSlides) => {
  const [slidesId, setSlidesId] = useState(null);
  const [editedSlides, setEditedSlides] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [slidesToDelete, setSlidesToDelete] = useState(null);
  const [confirmDeleteSlides, setConfirmDeleteSlides] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.salon-era.ru/stockfiles/all/filter?field=category&state=eq&value=8"
      );
      if (!response.ok) throw new Error("Ошибка при получении данных");
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    if (slidesToDelete === null) return;
    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении работы");
      setSlides((prev) => prev.filter((slide) => slide.id !== id));
      closeMessageDeleteSlide();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleSave = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("clientData", JSON.stringify({ ...editedSlides, id }));
    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении слайда: ${errorMessage}`);
      }

      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === id ? { ...slide, ...editedSlides } : slide
        )
      );
      setSlidesId(null);
      setEditedSlides({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const showMessageDeleteSlide = (id) => {
    setSlidesToDelete(id);
    setConfirmDeleteSlides(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteSlide = () => {
    setSlidesToDelete(null);
    setConfirmDeleteSlides(false);
    document.body.style.overflow = "scroll";
  };

  const handleEdit = (slides) => {
    setSlidesId(slides.id);
    setEditedSlides(slides);
  };

  const deletImagePreview = () => {
    setImagePreview(null);
  };

  const uploadImage = async (event) => {
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      console.log("Image compressed:", result);
      setSelectedFile(result.compressedFile);
      setImagePreview(result.dataUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSlides((prev) => ({ ...prev, [name]: value }));
  };

  return {
    slidesId,
    editedSlides,
    selectedFile,
    activeInput,
    imagePreview,
    slidesToDelete,
    confirmDeleteSlides,
    loading,
    setSlidesId,
    setEditedSlides,
    setActiveInput,
    handleDelete,
    handleSave,
    handleEdit,
    showMessageDeleteSlide,
    closeMessageDeleteSlide,
    deletImagePreview,
    uploadImage,
    handleChange,
    setSelectedFile,
    setImagePreview,
  };
};
