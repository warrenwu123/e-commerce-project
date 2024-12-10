import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop-slice";
import cartSlice from "./cart-slice";
import addressSlice from "./address-slice";
import shoppingOrderSlice from "./order-slice";
import adminOrderSlice from "./admin/order-slice";
const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice,
        shopProducts:shopProductsSlice,
        cart:cartSlice,
        address:addressSlice,
        shopOrder:shoppingOrderSlice,
        adminOrder:adminOrderSlice
    }
})

export default store;