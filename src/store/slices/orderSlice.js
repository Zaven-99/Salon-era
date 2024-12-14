import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  orderNumber: 1, 
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        number: state.orderNumber, 
      };

      
      state.orders.push(newOrder);
      state.orderNumber += 1;

     
      localStorage.setItem("orders", JSON.stringify(state.orders));
      localStorage.setItem("orderNumber", state.orderNumber);
    },
    clearOrders: (state) => {
      state.orders = [];
      state.orderNumber = 1; 
      localStorage.removeItem("orders"); 
      localStorage.removeItem("orderNumber"); 
    },
  },
});


export const { saveOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
