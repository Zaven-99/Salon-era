import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statuses: [], 
};

 
const orderStatusesSlice = createSlice({
  name: "orderStatuses",
  initialState,
  reducers: {
    addStatus: (state, action) => {
       const exists = state.statuses.find(
        (status) => status.orderId === action.payload.orderId
      );
      if (!exists) {
        state.statuses.push(action.payload);
      }
    },
    removeAllStatuses: (state) => {
      state.statuses = [];
    },
  },
});

export const { addStatus, removeAllStatuses } = orderStatusesSlice.actions;
export default orderStatusesSlice.reducer;
