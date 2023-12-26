import connectDB from "../../DB/connection.js";
import authRouter from "../modules/auth/auth.router.js"
import subcateroyRouter from "../modules/subcategory/subcategory.router.js"
import categoryRouter from "../modules/categories/categories.router.js"
import { globalErrorHandler } from "../services/errorHandling.js";
const initApp=async(app,express)=>{
connectDB();
app.use(express.json());
app.get("/",(req,res)=>{
    return res.status(200).json({message:"welcome"});
});
app.use("/auth",authRouter);
app.use("/subcategories",subcateroyRouter);
app.use("/categories",categoryRouter);
app.get("*",(req,res)=>{
    return res.status(500).json({message:"page not found"})
});  
app.use(globalErrorHandler);  
}
export default initApp;