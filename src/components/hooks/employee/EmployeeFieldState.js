import { useState, useEffect } from "react";

export const EmployeeFieldState = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [addEmployee, setAddEmployee] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [positions, setPositions] = useState([]);

  const fetchPosition = async () => {
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=должность"
      );

      if (!response.ok) {
        throw new Error(`Ошибка http! статус: ${response.status}`);
      }

      const data = await response.json();
      setPositions(data);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, []);

  const getPositionTextById = (id) => {
    const categoryId = Number(id);
    const category = positions.find((item) => item.id === categoryId);
    return category ? category.value : "Категория не найдена";
  };

  const toggleHelpModal = () => {
    setShowHelpModal(!showHelpModal);
  };

  const handleKeyDown = (e) => {
    const value = e.target.value;

    if (value === "+7" && e.key === "Backspace") {
      e.preventDefault();
      return;
    }

    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }

    if (value.length >= 12 && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const toggleOpen = () => {
    setAddEmployee(true);
    document.body.style.overflow = "hidden";
  };

  const toggleClose = () => {
    setAddEmployee(false);
    document.body.style.overflow = "scroll";
  };

  return {
    showHelpModal,
    setShowHelpModal,
    addEmployee,
    setAddEmployee,
    loading,
    setLoading,
    employee,
    setEmployee,
    positions,
    getPositionTextById,
    toggleHelpModal,
    handleKeyDown,
    toggleOpen,
    toggleClose,
  };
};
