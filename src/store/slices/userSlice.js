// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   id: null,
//   firstName: null,
//   lastName: null,
//   login: null,
//   email: null,
//   phone: null,
//   gender: null,
//   clientType: null,
//   imageLink: null,
//   token: false,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser(state, action) {
//       Object.assign(state, action.payload);
//     },
//     removeUser(state) {
//       Object.assign(state, initialState);
//     },
//   },
// });

// export const { setUser, removeUser } = userSlice.actions;

// export default userSlice.reducer;


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
  clientType: null,
  imageLink: null,
  token: false,
};

// Слайс Redux для пользователя
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      // Получаем данные из payload
      const user = action.payload;

      // Дешифруем все необходимые поля
      const fieldsToDecrypt = [
        "firstName",
        "lastName",
        // "login",
        "email",
        "phone",
      ];

      // Расшифровываем данные и сохраняем в стейт
      fieldsToDecrypt.forEach((field) => {
        if (user[field]) {
          user[field] = decryptField(user[field]);
        }
      });

      // Сохраняем расшифрованные данные
      Object.assign(state, user);
    },

    removeUser(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
