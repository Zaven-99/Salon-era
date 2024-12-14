import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedServices: [],
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    addService(state, action) {
      const serviceToAdd = action.payload;
      
      const existingServiceIndex = state.selectedServices.findIndex(
        (service) => service.id === serviceToAdd.id
      );

      if (existingServiceIndex >= 0) {
       
        state.selectedServices.splice(existingServiceIndex, 1);
      } else {
        
        state.selectedServices = [serviceToAdd];
      }
    },

    removeService(state, action) {
      const serviceIdToRemove = action.payload;
      state.selectedServices = state.selectedServices.filter(
        (service) => service.id !== serviceIdToRemove
      );
    },

    clearServices(state) {
      state.selectedServices = [];
    },
  },
});

export const { addService, removeService, clearServices } =
  serviceSlice.actions;

export default serviceSlice.reducer;
