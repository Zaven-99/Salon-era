import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

export const EditModalState = ({
  setEmployee,
  setEmployeeId,
  setEditedEmployee,
  editedEmployee,
}) => {
  const {
    register,
    control,
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
      position: "",
      dateWorkIn: "",
      gender: "",
      clientType: "employee",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false)
  const fetchCategory = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=должность"
      );
      if (!response.ok) throw new Error("Ошибка при загрузке категорий");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e, categoryId) => {
    const { checked } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      arrayTypeWork: checked
        ? [...prev.arrayTypeWork, categoryId]
        : prev.arrayTypeWork.filter((id) => id !== categoryId),
    }));
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
    setSelectedFile(null);
  };

  const handleSave = async (id) => {
    setLoading(true);
    const formattedDate = `${editedEmployee.dateWorkIn}`;
    const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({ ...editedEmployee, dateWorkIn: formattedDate, id })
    );

    if (selectedFile) {
      formData.append("imageData", selectedFile, selectedFile.name);
    }

    try {
      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Ошибка при сохранении: ${errorMessage}`);
      }

      setEmployee((prev) =>
        prev.map((emp) => (emp.id === id ? editedEmployee : emp))
      );

      setEmployeeId(null);
      setEditedEmployee({});
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      window.location.reload();
      setLoading(false);
    }
  };

  return {
    register,
    control,
    errors,
    showPassword,
    setShowPassword,
    activeInput,
    setActiveInput,
    selectedFile,
    categories,
    handleChange,
    handleCategoryChange,
    uploadImage,
    deletImagePreview,
    handleSave,
    imagePreview,
    loading,
  };
};
