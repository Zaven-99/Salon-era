import { useState, useEffect } from "react";

export const DeleteCategoryState = (toggleClose) => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=Категория услуг",
        { method: "GET" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();
      setCategory(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.salon-era.ru/catalogs?id=${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!response.ok) throw new Error("Ошибка при удалении категории");

      setCategory((prevCat) => prevCat.filter((cat) => cat.id !== id));
      toggleClose();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
      window.location.reload(); 
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return {
    category,
    loading,
    handleDelete,
  };
};
