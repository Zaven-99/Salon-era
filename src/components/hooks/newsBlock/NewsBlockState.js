import { useState, useEffect } from "react";

export const NewsBlockState = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.salon-era.ru/news/all", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Ошибка при получении новостей");
      const data = await response.json();

      setNews(data);
    } catch (error) {
      console.error("Ошибка при загрузке новостей:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (utcDateString) => {
    // Если строка не содержит суффикса Z, добавим его
    const utcStringWithZ = utcDateString.endsWith("Z")
      ? utcDateString
      : utcDateString + "Z";

    const d = new Date(utcStringWithZ);

    return `${d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}, ${d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  };
  

  useEffect(() => {
    (async () => {
      await fetchNews();
    })();
  }, []);

  return { loading, news, formatDate };
};
