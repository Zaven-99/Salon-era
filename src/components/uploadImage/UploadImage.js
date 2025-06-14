import React from "react";
import styles from "./uploadImage.module.scss";

const UploadImage = ({
  onChange,
  label = "Выбрать изображение",
  name = "image_link",
  accept = "image/*",
}) => {
  return (
    <div className={styles["file-upload-wrapper"]}>
      <label htmlFor={name} className={styles["file-upload-label"]}>
        {label}
      </label>
      <input
        id={name}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className={styles["file-upload-input"]}
      />
    </div>
  );
};

export default UploadImage;
