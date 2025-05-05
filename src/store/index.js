import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./slices/userSlice";
import serviceReducer from "./slices/serviceSlice";
import barberReducer from "./slices/barberSlice";
import orderReducer from "./slices/orderSlice";
import positionsReducer from "./slices/positionsSlices";
import { addNotification } from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    user: useReducer,
    service: serviceReducer,
    barber: barberReducer,
    order: orderReducer,
    notification: addNotification,
    positions: positionsReducer,
  },
});
