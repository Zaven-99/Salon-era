import React from "react";
import styles from "./imagePreview.module.scss";
import CustomButton from "../customButton/CustomButton";

const ImagePreview = ({ imagePreview, deletImagePreview }) => {
  return (
    <div>
      {imagePreview && (
        <div>
          <h4>Предпросмотр</h4>
          <div className={styles["preview-block"]}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "70px", height: "auto", borderRadius: "4px" }}
            />

            <CustomButton
              label="Удалить"
              onClick={deletImagePreview}
              className={styles["r-btn"]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
