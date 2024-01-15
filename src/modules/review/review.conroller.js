import bookingModel from "../../../DB/model/booking.model.js";
import reviewModel from "../../../DB/model/review.model.js";

export const create=async(req,res,next)=>{
    const {productId}=req.params;
    const {comment,rating}=req.body;
    const Booking=await bookingModel.findOne({
        userId:req.user._id,
        status:"Done",
        "products.productId":productId
    })
    if(!Booking){
        return next(new Error(`can not review this product`,{cause:400}))
    }
    const checkReview=await reviewModel.findOne({
        createdBy:req.user._id,
        productId:productId.toString()
    })
    if(checkReview){
        return next(new Error(`alredy review`,{cause:404}));
    }
    const review=await reviewModel.create({
        comment,
        rating,
        createdBy:req.user._id,
        bookingId:Booking._id,
        productId
    });
    if(!review){
        return next(new Error(`error while adding review`,{cause:400}));
    }
    return res.status(201).json({message:"success",review});
}