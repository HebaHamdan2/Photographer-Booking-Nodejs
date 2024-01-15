import budlescouponModel from "../../../DB/model/bundlesCoupon.model.js";

export const createBundlesCoupon=async(req,res,next)=>{
 const{name}=req.body;
if(req.body.expireDate){
    req.body.expireDate = new Date(req.body.expireDate);
}
if (await budlescouponModel.findOne({ name })) {
   return next(new Error(`{ message: "coupon name already exists" }`,{cause:409}))  
}
const coupon = await budlescouponModel.create(req.body);
  return res.status(201).json({ message: "success", coupon });
}
export const getCoupons=async(req,res,next)=>{
    const coupons=await budlescouponModel.find({isDeleated:false});
    return res.status(200).json({message:"success",coupons});
}
export const updateCoupon=async(req,res,next)=>{
const coupon=await budlescouponModel.findById(req.params.id);
if(!coupon){
    return next(new Error(`coupon not found`,{cause:404}));
}
if(req.body.name){
    if(await budlescouponModel.findOne({name:req.body.name})){
        return next(new Error(`coupon ${req.body.name} already exists`,{cause:409}));
    }
    coupon.name=req.body.name;

}
if(req.body.amount){
    coupon.amount=req.body.amount;
}
await coupon.save();
return res.status(200).json({message:"success",coupon});
}
export const softDelete=async(req,res,next)=>{
const {id}=req.params;
const coupon= await budlescouponModel.findOneAndUpdate(
    { _id: id ,isDeleated: false },
    { isDeleated: true},
    { new:true }
);
if(!coupon){
    return next(new Error(`can't delete this coupon`,{cause:404}));
}
return res.status(200).json({message:"success",coupon});
}
export const hardDelete=async(req,res,next)=>{
    const{id}=req.params;
    const coupon=await budlescouponModel.findOneAndDelete(
        {_id:id}
        );
        if(!coupon){
            return next(new Error(`can't delete this coupon`,{cause:404}));
        }
        return res.status(200).json({message:"success"});
}
export const restoreCoupon=async(req,res,next)=>{
    const {id}=req.params;
    const coupon=await budlescouponModel.findOneAndUpdate(
        {_id : id, isDeleated:true},
        {isDeleated:false},
        {new:true}
    );
    if(!coupon){
        return next(new Error(`can't restore this coupon`),{cause:404});
    }
    return res.status(200).json({message:"success"});
}