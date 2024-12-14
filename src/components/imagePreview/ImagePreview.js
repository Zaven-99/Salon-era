import React from 'react';
import styles from './imagePreview.module.scss'


const ImagePreview = ({imagePreview, deletImagePreview}) => {
	return (
    <div>
      {imagePreview && (
        <div>
          <h4>Предпросмотр</h4>
          <div className={styles["preview-block"]}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "70px", height: "auto" }}
            />
            <button
              className={styles["delete-Image__Preview"]}
              onClick={deletImagePreview}
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;