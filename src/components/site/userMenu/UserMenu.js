import React, { useState } from "react";
import styles from "./userMenu.module.scss";
import { useAuth } from "../../../use-auth/use-auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/slices/userSlice";

import avatar from "../../../img/icons/avatar.png";

const UserMenu = ({ openProfile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const { id, firstName, lastName, imageLink } = useAuth();
  const dispatch = useDispatch();


   
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        uploadImage(file);
      } else {
        alert("Выберите файл изображения.");
      }
    }
  };

  const uploadImage = async (file) => {
  const formData = new FormData();

    formData.append(
      "clientData",
      JSON.stringify({
        id,
        firstName,
      })
    );

    if (file) {
      formData.append("imageData", file, file.name);
    }
    try {
      const response = await fetch(
        `http://95.163.84.228:6533/clients/update`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Ошибка при сохранении: ${errorMessage}`);
      }

      const data = await response.json();
      setAvatarUrl(data)
       localStorage.setItem(
         "user",
         JSON.stringify({
           id,
           firstName: data.firstName,
           lastName: data.lastName,
           email: data.email,
           phone: data.phone,
           gender: data.gender,
           imageLink: data.imageLink,
           token: true,
         })
       );

       dispatch(
         setUser({
           id,
           firstName: data.firstName,
           lastName: data.lastName,
           email: data.email,
           phone: data.phone,
           gender: data.gender,
           imageLink: data.imageLink,
           token: true,
         })
       );
       
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    }finally{
      window.location.reload();
    }
  };

  return (
    <div className={styles["user-menu"]}>
      <div className={styles.avatar}>
        <label htmlFor="image-upload">
          <img
            src={avatarUrl || imagePreview ||imageLink || avatar}
            alt="Avatar"
            className={styles.avatarImage}
          />
        </label>
        <input
          id="image-upload"
          type="file"
          className={styles.imageInput}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>

      <div className={styles["user"]} onClick={openProfile}>
        <p className={styles['user-name']}>{firstName}</p>
        <p className={styles['user-name']}>{lastName}</p>
      </div>
    </div>
  );
};

export default UserMenu;
