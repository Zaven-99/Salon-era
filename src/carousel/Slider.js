import React, { useEffect, useState, Children, cloneElement } from "react";
import styles from "./slider.module.scss";

const SLIDE_INTERVAL = 10000;

const Slider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [offset, setOffset] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    setPageWidth(windowWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setPages(
      Children.map(children, (child) => {
        return cloneElement(child, {
          style: {
            height: "100%",
            minWidth: `${pageWidth}px`,
            maxWidth: `${pageWidth}px`,
          },
        });
      })
    );
  }, [children, pageWidth]);

  useEffect(() => {
    const handleLeftArrowClick = () => {
      setOffset((currentOffset) => {
        let newOffset = currentOffset + pageWidth;
        if (newOffset > 0) {
          newOffset = -pageWidth * (pages.length - 1);
        }
        return Math.min(newOffset, 0);
      });
    };

    const intervalId = setInterval(() => {
      handleLeftArrowClick();
    }, SLIDE_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [pageWidth, pages.length]);  

  return (
    <div className={styles["main-container"]}>
      <div className={styles.window}>
        <div
          className={styles["all-items-container"]}
          style={{
            transform: `translateX(${offset}px)`,
            width: `${pageWidth * pages.length}px`,
          }}
        >
          {pages}
        </div>
      </div>
    </div>
  );
};

export default Slider;
