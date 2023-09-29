import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};
const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    add(state, action) {
      state.data.push(action.payload);
    },
    remove(state, action) {
      let result = state.data.filter((item) => item.id !== action.payload.id);
      state.data = result;
    },
		editData(state,action) {
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
    builder.addCase(getSubCategory.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { add, remove, editData, search } = subCategorySlice.actions;
export default subCategorySlice.reducer;
export const getSubCategory = createAsyncThunk("subcategory", async (id) => {
  const data = await fetch(`http://localhost:1337/list/${id}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  const result = await data.json();
  return result.data;
});
