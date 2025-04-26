import { useEffect, useState } from "react";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const WorkListState = (setWorks) => {
  const [worksId, setWorksId] = useState(null);
  const [editedWorks, setEditedWorks] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeInput, setActiveInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [groupedWorks, setGroupedWorks] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [workToDelete, setWorkToDelete] = useState(null);
  const [confirmDeleteWork, setConfirmDeleteWork] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");
      if (!response.ok) throw new Error("Ошибка при получении категорий");
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      console.error("Ошибка при получении категорий:", error);
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");
      if (!response.ok) throw new Error("Ошибка при получении данных");
      const data = await response.json();
      setWorks(data);

      const filteredData = data.filter((work) => work.category !== "8");

      const grouped = filteredData.reduce((acc, work) => {
        const category = work.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(work);
        return acc;
      }, {});
      setGroupedWorks(grouped);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (workToDelete === null) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/stockfiles?id=${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении работы");
      setWorks((prevWorks) => prevWorks.filter((work) => work.id !== id));
      closeMessageDeleteWork();
      setWorksId(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      window.location.reload();
    }
  };

  const showMessageDeleteWork = (id) => {
    setWorkToDelete(id);
    setConfirmDeleteWork(true);
    document.body.style.overflow = "hidden";
  };

  const closeMessageDeleteWork = () => {
    setConfirmDeleteWork(false);
    setWorkToDelete(null);
    document.body.style.overflow = "scroll";
  };

  const handleSave = async (id) => {
    setLoading(true);

    const serviceToUpdate = { ...editedWorks, id };

    const formData = new FormData();

    formData.append("clientData", JSON.stringify(serviceToUpdate));

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
        throw new Error(`Ошибка при сохранении услуги: ${errorMessage}`);
      }

      setWorks((prevWorks) =>
        prevWorks.map((works) => (works.id === id ? editedWorks : works))
      );
      setWorksId(null);
      setEditedWorks({});
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const deletImagePreview = () => {
    setImagePreview(null);
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

  const handleEdit = (slides) => {
    setWorksId(slides.id);
    setEditedWorks(slides);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWorks((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchCategories();
    fetchWorks();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categoryData.find(
      (cat) => cat.id === parseInt(categoryId)
    );
    return category ? category.value : "Неизвестная категория";
  };

  return {
    worksId,
    setWorksId,
    editedWorks,
    setEditedWorks,
    selectedFile,
    setSelectedFile,
    activeInput,
    setActiveInput,
    imagePreview,
    setImagePreview,
    groupedWorks,
    categoryData,
    workToDelete,
    confirmDeleteWork,
    loading,
    setLoading,
    handleDelete,
    showMessageDeleteWork,
    closeMessageDeleteWork,
    handleSave,
    deletImagePreview,
    uploadImage,
    handleEdit,
    handleChange,
    getCategoryName,
  };
};
