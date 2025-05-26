import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./slices/userSlice";
import serviceReducer from "./slices/serviceSlice";
import barberReducer from "./slices/barberSlice";
import orderReducer from "./slices/orderSlice";
import positionsReducer from "./slices/positionsSlices";
import  notificationReducer  from "./slices/notificationSlice";
import { orderMiddleware } from "./slices/orderMiddleware";

export const store = configureStore({
  reducer: {
    user: useReducer,
    service: serviceReducer,
    barber: barberReducer,
    order: orderReducer,
    notification: notificationReducer,
    positions: positionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderMiddleware),
});
