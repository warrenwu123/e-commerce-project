require("dotenv").config({ path: ".env.local" });
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./route/auth/auth-routes");
const adminProductsRouter = require("./route/admin/product-route");
const productRouter = require("./route/shop/product-route");
const shopCartRouter = require("./route/shop/cart-route");
const addressRouter = require("./route/shop/address-route");
const orderRouter = require("./route/shop/order-route");
const adminOrderRouter = require("./route/admin/order-route");
const shopSearchRouter = require("./route/shop/search-contoller");
const reviewRouter = require("./route/shop/review-route");
const commonFeatureRouter = require("./route/common/feature-route");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));


const app = express();
const PORT = process.env.PORT || 5000;
  
app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "DELETE", "PUT"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
      ],
      credentials: true,
    })
  );

app.use(cookiePaser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/auth",authRouter);
app.use("/api/admin/products",adminProductsRouter);
app.use("/api/shop/products",productRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/order", orderRouter);
app.use("/api/admin/order", adminOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", reviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));