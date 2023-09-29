import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};
const prodcutSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    add(state, action) {
      state.data.push(action.payload);
    },
    remove(state, action) {
      let result = state.data.filter((item) => item.id !== action.payload.id);
      state.data = result;
    },
		changeStatus(state,action) {
			state.data.map((item)=> {
				if(item.id === action.payload.id) {
					item.status = action.payload.status;
				}
			})
		},
		search(state,action) {
			state.data = action.payload
		}
  },
  extraReducers: (builder) => {
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { add, remove, changeStatus, search } = prodcutSlice.actions;
export default prodcutSlice.reducer;
export const getProduct = createAsyncThunk("product", async () => {
  const data = await fetch("http://localhost:1337/listProducts", {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const result = await data.json();
  return result.data;
});
