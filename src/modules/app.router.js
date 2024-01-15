import connectDB from "../../DB/connection.js";
import authRouter from "../modules/auth/auth.router.js"
import subcateroyRouter from "../modules/subcategory/subcategory.router.js"
import categoryRouter from "../modules/categories/categories.router.js"
import productRouter from "../modules/products/products.router.js"
import cartRouter from "../modules/cart/cart.router.js"
import bookingRouter from "./booking/booking.router.js"
import userRouter from "./user/user.router.js"
import reviewRouter from "./review/review.router.js"
import cors from "cors";
import couponRouter from "../modules/bundlescoupon/bundlescoupon.router.js"
import { globalErrorHandler } from "../services/errorHandling.js";
const initApp=async(app,express)=>{
app.use(cors());//to manage whose frontend use API
connectDB();
app.use(express.json());
app.get("/",(req,res)=>{
    return res.status(200).json({message:"welcome"});
});
app.use("/auth",authRouter);
app.use("/subcategories",subcateroyRouter);
app.use("/categories",categoryRouter);
app.use("/products",productRouter);
app.use("/cart",cartRouter);
app.use("/coupon",couponRouter);
app.use("/booking",bookingRouter);
app.use("/user",userRouter);
app.use("/review",reviewRouter)
app.use("*",(req,res)=>{
    return res.status(500).json({message:"page not found"})
});  
app.use(globalErrorHandler);  
}
export default initApp;