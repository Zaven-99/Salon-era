
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBarber: null,
  slotsByBarber: {}, 
};

const barberSlice = createSlice({
  name: "barber",
  initialState,
  reducers: {
    selectBarber(state, action) {
      const barberToSelect = action.payload;

     
      if (
        state.selectedBarber &&
        state.selectedBarber.id === barberToSelect.id
      ) {
        return;
      }

      state.selectedBarber = barberToSelect; 
    },
    clearBarber(state) {
      state.selectedBarber = null;
    },
    setSlotsForBarber(state, action) {
      const { barberId, slots } = action.payload;
      state.slotsByBarber[barberId] = slots; 
    },
    clearSlotsForBarber(state, action) {
      const barberId = action.payload;
      delete state.slotsByBarber[barberId]; 
    },
  },
});


export const {
  selectBarber,
  clearBarber,
  setSlotsForBarber,
  clearSlotsForBarber,
} = barberSlice.actions;


export default barberSlice.reducer;
