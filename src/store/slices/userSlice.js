import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

// Ключ для дешифровки
const base64Key = "ECqDTm9UnVoFn2BD4vM2/Fgzda1470BvZo4t1PWAkuU=";
const key = CryptoJS.enc.Base64.parse(base64Key);

// Функция дешифровки
const decryptField = (encryptedValue) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Ошибка при расшифровке:", e);
    return "Ошибка расшифровки";
  }
};

// Начальное состояние пользователя
const initialState = {
  id: null,
  firstName: null,
  lastName: null,
  login: null,
  email: null,
  phone: null,
  gender: null,
  role: null,
  imageLink: null,
  token: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload;

      if (!user) return;
      const fieldsToDecrypt = [
        "firstName",
        "lastName",
        "password",
        "email",
        "phone",
        "role",
      ];
      const decryptedUser = {};

      // Дешифруем только необходимые поля
      fieldsToDecrypt?.forEach((field) => {
        if (user[field]) {
          decryptedUser[field] = decryptField(user[field]);
        }
      });

      // Копируем остальные поля без расшифровки
      Object.keys(user).forEach((key) => {
        if (!fieldsToDecrypt.includes(key)) {
          decryptedUser[key] = user[key];
        }
      });

      // Если imageLink не зашифрован, просто передаем его
      decryptedUser.imageLink = user.imageLink;

      // Обновляем поля в состоянии
      Object.entries(decryptedUser).forEach(([key, value]) => {
        if (value !== undefined) {
          state[key] = value;
        }
      });
    },

    removeUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
