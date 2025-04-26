import { useState, useEffect } from "react";

export const WorksFieldState = () => {
  const [works, setWorks] = useState([]);
  const [addWorks, setAddWorks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=Категория работ"
      );

      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();

      setCategories(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const getCategoryText = (categoryId) => {
    const category = categories.find((cat) => cat.value === categoryId);
    return category ? category.value : "Неизвестная работа";
  };

  const toggleOpen = () => {
    setAddWorks(true);
  };

  const toggleClose = () => {
    setAddWorks(false);
  };

  return {
    works,
    setWorks,
    addWorks,
    setAddWorks,
    loading,
    categories,
    getCategoryText,
    toggleOpen,
    toggleClose,
  };
};
 