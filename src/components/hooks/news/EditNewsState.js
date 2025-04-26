import { useState } from "react";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const EditNewsState = ({
  editedNews,
  setEditedNews,
  setNews,
  setNewsId,

}) => {
  const [activeInput, setActiveInput] = useState("");
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false)

  const closeMessageDeleteNews = () => {
    setConfirmDeleteNews(false);
    setNewsToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const showMessageDeleteNews = (id) => {
    setNewsToDelete(id);
    setConfirmDeleteNews(true);
    document.body.style.overflow = "hidden";
  };

  const handleDelete = async (id) => {
    if (newsToDelete === null) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api.salon-era.ru/news?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Ошибка при удалении новости");
      setNews((prevNews) => prevNews.filter((newsItem) => newsItem.id !== id));
      closeMessageDeleteNews();
    } catch (error) {
      console.error("Ошибка при удалении новости:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  const handleSave = async (id, originalNews) => {
    setLoading(true);

    const serviceToUpdate = { ...editedNews, id };
    const formData = new FormData();
    formData.append("clientData", JSON.stringify(serviceToUpdate));
    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(`https://api.salon-era.ru/news/update`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }
      setNews((prevNews) =>
        prevNews.map((item) => (item.id === id ? editedNews : originalNews))
      );
      setNewsId(null);
      setEditedNews({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNews((prev) => ({ ...prev, [name]: value }));
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
    activeInput,
    setActiveInput,
    imagePreview,
    deletImagePreview,
    uploadImage,
    handleChange,
    handleSave,
    handleDelete,
    confirmDeleteNews,
    showMessageDeleteNews,
    closeMessageDeleteNews,
    newsToDelete,
    loading,
  };
};
