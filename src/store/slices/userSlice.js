import { createSlice } from "@reduxjs/toolkit";

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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      Object.assign(state, action.payload);  
    },
    removeUser(state) {
      Object.assign(state, initialState);  
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
