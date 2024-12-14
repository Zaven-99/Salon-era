import React from "react";
import styles from "./slides.module.css";

import Slider from "./Slider";

import { sliderContent } from './../storage/API';


const Slides = () => {
  

  return (
    <Slider>
      {sliderContent.map((item) => (
        <div key={item.id} className={styles.slides}>
          <div
            style={{ backgroundImage: `url(${item.img})` }}
            className={styles.description}
          >
            <h1 className={styles.text}>{item.text}</h1>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Slides;
