import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние для сотрудников
const initialState = [];

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    // Действие для добавления нового сотрудника
    addEmployee(state, action) {
      state.push(action.payload);
    },

    // Действие для обновления информации о сотруднике
    updateEmployee(state, action) {
      const { id, updatedData } = action.payload;
      const employeeIndex = state.findIndex((employee) => employee.id === id);
      if (employeeIndex !== -1) {
        // Обновляем данные сотрудника по id
        state[employeeIndex] = { ...state[employeeIndex], ...updatedData };
      }
    },

    // Действие для удаления сотрудника
    removeEmployee(state, action) {
      const { id } = action.payload;
      const employeeIndex = state.findIndex((employee) => employee.id === id);
      if (employeeIndex !== -1) {
        state.splice(employeeIndex, 1);
      }
    },
  },
});

export const { addEmployee, updateEmployee, removeEmployee } =
  employeeSlice.actions;

export default employeeSlice.reducer;
