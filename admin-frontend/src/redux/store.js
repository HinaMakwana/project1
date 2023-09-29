import {configureStore } from '@reduxjs/toolkit'
import categorySlice from './features/categories/categorySlice'
import userSlice from './features/users/userSlice'
import subCategorySlice from './features/subCategory/subCategorySlice'
import productSlice from './features/products/productSlice'

export const store = configureStore({
	reducer: {
		category: categorySlice,
		users: userSlice,
		subcategory: subCategorySlice,
		product: productSlice,
	},
})