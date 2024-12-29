import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop-slice";
import cartSlice from "./cart-slice";
import addressSlice from "./address-slice";
import shoppingOrderSlice from "./order-slice";
import adminOrderSlice from "./admin/order-slice";
import searchSlice from "./search-slice";
import reviewSlice from "./review-slice";
import commonFeatureSlice from "./common-slice";
const store = configureStore({
    reducer:{
        auth:authReducer,
        adminProduct:adminProductsSlice,
        shopProducts:shopProductsSlice,
        cart:cartSlice,
        address:addressSlice,
        shopOrder:shoppingOrderSlice,
        adminOrder:adminOrderSlice,
        shopSearch:searchSlice,
        review:reviewSlice,
        commonfeature:commonFeatureSlice
    }
})

export default store;