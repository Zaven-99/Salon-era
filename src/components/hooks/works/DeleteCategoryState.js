import { useState, useEffect } from "react";

export const DeleteCategoryState = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all", {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();
      const filteredCategory = data.filter(
        (item) => item.category === "Категория работ"
      );
      setCategory(filteredCategory);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.salon-era.ru/catalogs?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Ошибка при удалении категории");
      setCategory((prevCat) => prevCat.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
	  window.location.reload()
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return { category, loading, handleDelete };
};
 
