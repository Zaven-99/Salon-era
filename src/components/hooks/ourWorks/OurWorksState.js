import { useState, useEffect } from "react";

export const OurWorksState = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [works, setWorks] = useState([]);
  const [groupedWorks, setGroupedWorks] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleImageClick = (imageLink) => {
    setSelectedImage(imageLink);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all");

      if (!response.ok)
        throw new Error("Ошибка при получении данных категорий");

      const data = await response.json();
      const categoryObj = data.reduce((acc, category) => {
        acc[category.id] = category.value;
        return acc;
      }, {});

      setCategoryMap(categoryObj);
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) throw new Error("Ошибка при получении данных");

      const data = await response.json();
      setWorks(data);

      const grouped = data.reduce((acc, work) => {
        const categoryId = work.category;
        const categoryName = categoryMap[categoryId];

        if (categoryName) {
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(work);
        }
        return acc;
      }, {});

      setGroupedWorks(grouped);

      const uniqueCategories = Object.keys(grouped);
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (Object.keys(categoryMap).length > 0) {
      fetchWorks();
    }
  }, [categoryMap]);

  return {
    activeCategory,
    setActiveCategory,
    works,
    groupedWorks,
    loading,
    selectedImage,
    setSelectedImage,
    categories,
    categoryMap,
    handleCategoryClick,
    handleImageClick,
    handleCloseModal,
  };
};
