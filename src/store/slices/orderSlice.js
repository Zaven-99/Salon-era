import { createSlice } from "@reduxjs/toolkit";

const savedOrders = localStorage.getItem("orders");
const savedOrderNumber = localStorage.getItem("orderNumber");

const initialState = {
  orders: savedOrders ? JSON.parse(savedOrders) : [],
  orderNumber: savedOrderNumber ? parseInt(savedOrderNumber) : 1,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        number: state.orderNumber, // текущий номер
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
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.record.id !== action.payload
      );
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
  },
});

export const { saveOrder, clearOrders, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
