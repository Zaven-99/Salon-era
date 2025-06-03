import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";
import { compressAndPreviewImage } from "../../../utils/uploadImage";

const useImageUpload = (id, firstName) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleImageChange = async (event) => {
    const result = await compressAndPreviewImage(event, {}, setLoading);
    if (result) {
      setImagePreview(result.dataUrl);
      await uploadImage(result.compressedFile);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("clientData", JSON.stringify({ id, firstName }));
      formData.append("imageData", file, file.name);

      const response = await fetch(`https://api.salon-era.ru/clients/update`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();

      dispatch(setUser({ ...data, token: true }));
      localStorage.setItem("user", JSON.stringify({ ...data, token: true }));
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    } finally {
      window.location.reload();
    }
  };

  return { imagePreview, handleImageChange, loading };
};

export default useImageUpload;
