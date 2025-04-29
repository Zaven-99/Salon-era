import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positions: [],
  isLoading: false,
  error: null,
};

const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPositions, setLoading, setError } = positionsSlice.actions;

export const fetchPositions = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch("https://api.salon-era.ru/positions");
    if (!response.ok) {
      throw new Error("Ошибка при получении должностей");
    }
    const data = await response.json();
    dispatch(setPositions(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default positionsSlice.reducer;
