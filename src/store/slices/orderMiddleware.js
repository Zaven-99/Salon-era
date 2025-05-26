import { saveOrder, clearOrders, removeOrder } from "./orderSlice";

export const orderMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const actionsToSync = [saveOrder.type, clearOrders.type, removeOrder.type];

  if (actionsToSync.includes(action.type)) {
    const state = store.getState().order;
    localStorage.setItem("orders", JSON.stringify(state.orders));
    localStorage.setItem("orderNumber", state.orderNumber.toString());
  }

  return result;
};
