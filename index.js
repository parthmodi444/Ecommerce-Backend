const express=require("express");
const mongoose=require("mongoose");
const app=express();
const dotenv=require("dotenv");
const userRoute=require("./routes/user");
const authRoute=require("./routes/auth");
const productRoute=require("./routes/product");
const cartRoute=require("./routes/cart");
const orderRoute=require("./routes/order");
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("db connection sucessfull")
}).catch((err) => {console.log(err)});
app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);
app.listen(3000,() => {
    console.log("Listening to port 3000");
})