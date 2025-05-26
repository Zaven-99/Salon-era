// import { createSlice } from "@reduxjs/toolkit";

// const savedOrders = localStorage.getItem("orders");
// const savedOrderNumber = localStorage.getItem("orderNumber");

// const initialState = {
//   orders: savedOrders ? JSON.parse(savedOrders) : [],
//   orderNumber: savedOrderNumber ? parseInt(savedOrderNumber) : 1,
// };

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     saveOrder: (state, action) => {
//       const newOrder = {
//         ...action.payload,
//         number: state.orderNumber, // текущий номер
//       };

//       state.orders.push(newOrder);
//       state.orderNumber += 1;

//       localStorage.setItem("orders", JSON.stringify(state.orders));
//       localStorage.setItem("orderNumber", state.orderNumber);
//     },
//     clearOrders: (state) => {
//       state.orders = [];
//       state.orderNumber = 1;
//       localStorage.removeItem("orders");
//       localStorage.removeItem("orderNumber");
//     },
//     removeOrder: (state, action) => {
//       state.orders = state.orders.filter(
//         (order) => order.record.id !== action.payload
//       );
//       localStorage.setItem("orders", JSON.stringify(state.orders));
//     },
//   },
// });

// export const { saveOrder, clearOrders, removeOrder } = orderSlice.actions;
// export default orderSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Безопасная загрузка из localStorage
function loadFromLocalStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

const initialState = {
  orders: loadFromLocalStorage("orders", []),
  orderNumber: parseInt(localStorage.getItem("orderNumber") || "1", 10),
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
    },
    clearOrders: (state) => {
      state.orders = [];
      state.orderNumber = 1;
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.record.id !== action.payload
      );
    },
    setOrder: (state, action) => {
      // Фильтруем только активные заказы (статус не 400 и не 500)
      const activeOrders = action.payload.filter(
        (order) => order.record?.status !== 400 && order.record?.status !== 500
      );
      state.orders = activeOrders;

      const maxNumber = activeOrders.reduce(
        (max, order) => (order.number > max ? order.number : max),
        0
      );
      state.orderNumber = maxNumber + 1;
    },
  },
});

export const { saveOrder, clearOrders, removeOrder, setOrder } = orderSlice.actions;
export default orderSlice.reducer;
