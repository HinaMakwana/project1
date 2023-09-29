import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
	data: [],
	status: 'ok'
}
const userSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		add(state, action) {
			state.push(action.payload);
		},
		remove(state, action) {
			return state.filter(item => item.id !== action.payload)
		},
	},
	extraReducers: (builder) => {
		builder
		// .addCase(getUsers.pending,(state,action) => {
		// 	state.status = 'pending';
		// })
		.addCase(getUsers.fulfilled, (state,action) => {
			state.data = action.payload ;
			state.status = 'ok'
		})
		// .addCase(getUsers.rejected,(state,action) => {
		// 	state.status = 'reject'
		// })
	}
});

export const {add, remove} = userSlice.actions;
export default userSlice.reducer;
export const getUsers = createAsyncThunk('users', async ()=> {
	const data = await fetch('http://localhost:1337/listAll/users',{
		method: 'GET',
		headers: {
			authorization: `Bearer ${localStorage.getItem('authToken')}`
		}
	})
	const result = await data.json();
	return result.data;
});
