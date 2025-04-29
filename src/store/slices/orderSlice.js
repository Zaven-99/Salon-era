import { createSlice } from "@reduxjs/toolkit";

// Загружаем сохранённые заказы и номер заказа из localStorage
const savedOrders = localStorage.getItem("orders");
const savedOrderNumber = localStorage.getItem("orderNumber");

const initialState = {
  orders: savedOrders ? JSON.parse(savedOrders) : [], // Если в localStorage есть заказы, загружаем их
  orderNumber: savedOrderNumber ? parseInt(savedOrderNumber) : 1, // Если в localStorage есть номер заказа, загружаем его
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

      // Сохраняем новые данные в localStorage
      localStorage.setItem("orders", JSON.stringify(state.orders));
      localStorage.setItem("orderNumber", state.orderNumber);
    },
    clearOrders: (state) => {
      state.orders = [];
      state.orderNumber = 1;
      localStorage.removeItem("orders");
      localStorage.removeItem("orderNumber");
    },
    // Новый экшен для удаления заказа
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.record.id !== action.payload
      );
      localStorage.setItem("orders", JSON.stringify(state.orders)); // Обновляем localStorage
    },
  },
});

export const { saveOrder, clearOrders, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
