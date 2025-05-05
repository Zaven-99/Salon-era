// src/context/OrdersProvider.js
import React, { createContext, useContext } from "react";
import { useOrdersState } from './OrdersState';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const state = useOrdersState();
  return (
    <OrdersContext.Provider value={state}>{children}</OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
