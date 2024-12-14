// actions.js
import { setUser, removeUser } from "./userSlice";
import { addService, removeService, clearServices } from "./serviceSlice";
import { selectBarber, clearBarber, setSlotsForBarber } from "./barberSlice";
import { saveOrder, clearOrders } from "./orderSlice";
 
 

export const login = (userData) => (dispatch) => {
  dispatch(setUser(userData));
};

export const logout = () => (dispatch) => {
  dispatch(removeUser());
};


export const addSelectedService = (serviceName) => (dispatch) => {
  dispatch(addService(serviceName));
};

 
export const removeSelectedService = (serviceName) => (dispatch) => {
  dispatch(removeService(serviceName));
};
 

export const clearSelectedServices = () => (dispatch) => {
  dispatch(clearServices());
};

export const selectChosenBarber = (barber) => (dispatch) => {
  dispatch(selectBarber(barber));
};

export const clearChosenBarber = () => (dispatch) => {
  dispatch(clearBarber());
};
export const savedOrders = (orderData) => (dispatch) => {
  dispatch(saveOrder(orderData)); 
};
export const clearedOrders = (dispatch) => {
  dispatch(clearOrders());
};

export const setBarberSlots = (barberId, slots) => (dispatch) => {
  dispatch(setSlotsForBarber({ barberId, slots }));
};