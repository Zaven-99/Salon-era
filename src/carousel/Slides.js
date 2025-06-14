import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import GenericSkeleton from "../utils/Skeleton";
import styles from "./slides.module.scss";
import Spinner from "../components/spinner/Spinner";

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

  if (slides.length === 0) {
    return (
      <GenericSkeleton
        headerWidths={["100%", "100%"]}
        itemCount={1}
        itemWidth="100%"
        itemHeight={500}
      />
    );
  }
  return (
    <Slider>
      {slides.map((item) => (
        <div key={item.id} className={styles.slides}>
          {loading && <Spinner />}
          {<GenericSkeleton /> && (
            <div
              style={{ backgroundImage: `url(${item.image_link})` }}
              className={styles.description}
            >
              <h1 className={styles.text}>{item.name}</h1>
            </div>
          )}
        </div>
      ))}
    </Slider>
  );
};

export default Slides;
