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

  const handleImageClick = (image_link) => {
    setSelectedImage(image_link);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/catalogs/all", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok)
        throw new Error("Ошибка при получении данных категорий");

      const data = await response.json();

      const filteredCategories = data.filter((category) => category.id !== 8);

      const categoryObj = filteredCategories.reduce((acc, category) => {
        acc[category.id] = category.value;
        return acc;
      }, {});

      setCategoryMap(categoryObj);
      setCategories(filteredCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка при получении данных");

      const data = await response.json();

      const filteredData = data.filter((work) => work.category !== "8");
      setWorks(filteredData);

      const grouped = filteredData.reduce((acc, work) => {
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
  // useEffect(() => {
  //   fetchWorks();
  // })

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
