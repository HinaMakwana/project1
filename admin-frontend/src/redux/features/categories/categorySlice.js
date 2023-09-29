import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    add(state, action) {
      state.data.push(action.payload);
    },
    remove(state, action) {
      let result = state.data.filter((item) => item.id !== action.payload.id);
      state.data = result;
    },
		edit(state,action) {
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
    builder.addCase(getCategory.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { add, remove, edit, search } = categorySlice.actions;
export default categorySlice.reducer;
export const getCategory = createAsyncThunk("category", async () => {
  const data = await fetch("http://localhost:1337/listCategories", {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const result = await data.json();
  return result.data;
});
