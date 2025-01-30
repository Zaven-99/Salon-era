import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Spinner from "../../src/components/spinner/Spinner";

import styles from "./slides.module.css";

const Slides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://api.salon-era.ru/stockfiles/all");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const filteredAndSortedData = data
        .filter((slides) => slides.category === "8")
        .sort((a, b) => a.id - b.id);

      setSlides(filteredAndSortedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <Slider>
      {slides.map((item) => (
        <div key={item.id} className={styles.slides}>
          <div
            style={{ backgroundImage: `url(${item.imageLink})` }}
            className={styles.description}
          >
            <h1 className={styles.text}>{item.name}</h1>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Slides;
