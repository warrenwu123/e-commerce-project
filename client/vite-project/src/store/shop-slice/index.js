import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};


export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {
        console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");
    
        const query = new URLSearchParams({
          ...filterParams,
          sortBy: sortParams,
        });
    
        const result = await axios.get(
          `http://localhost:5000/api/shop/products/get?${query}`
        );
    
        console.log(result);
    
        return result?.data;
      }
    );

    export const fetchProductDetails = createAsyncThunk(
        "/products/fetchProductDetails",
        async (id) => {
          const result = await axios.get(
            `http://localhost:5000/api/shop/products/get/${id}`
          );
      
          return result?.data;
        }
      );

export const shopProductsSlice = createSlice({
    name: "shopProducts",
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = action.payload.data;
        });
        builder.addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.productList = [];
        });
        builder.addCase(fetchProductDetails.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productDetails = action.payload.data;
        });
        builder.addCase(fetchProductDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.productDetails = null;
        });
    }
});

export const { setProductDetails } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
