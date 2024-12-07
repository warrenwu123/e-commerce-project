const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./route/auth/auth-routes");
const adminProductsRouter = require("./route/admin/product-route");
const productRouter = require("./route/shop/product-route");
const shopCartRouter = require("./route/shop/cart-route");
const addressRouter = require("./route/shop/address-route");

mongoose
  .connect("mongodb+srv://warrenwu:qewyop58458@cluster0.nxe7y.mongodb.net/")
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
app.use("/api/auth",authRouter);
app.use("/api/admin/products",adminProductsRouter);
app.use("/api/shop/products",productRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", addressRouter);
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));