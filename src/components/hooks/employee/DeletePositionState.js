import { useEffect, useState } from "react";

export const DeletePositionState = (toggleClose) => {
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosition = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.salon-era.ru/catalogs/all/filter?field=category&state=eq&value=должность"
      );

      if (!response.ok) {
        const errorText = await response.text();
        const statusCode = response.status;
        throw new Error(
          JSON.stringify({ message: errorText, status: statusCode })
        );
      }

      const data = await response.json();
      setPosition(data);
    } catch (e) {
      console.error("Ошибка загрузки должностей:", e);
    } finally {
      setLoading(false);
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
      if (!response.ok) throw new Error("Ошибка при удалении должности");

      setPosition((prev) => prev.filter((pos) => pos.id !== id));
      toggleClose?.();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
      document.body.style.overflow = "scroll";
    }
  };

  useEffect(() => {
    fetchPosition();
  }, []);

  return {
    position,
    loading,
    handleDelete,
  };
};
