import bookingModel from "../../../DB/model/booking.model.js";
import budlescouponModel from "../../../DB/model/bundlesCoupon.model.js";
import cartModel from "../../../DB/model/cart.model.js"
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";
export const createBooking=async(req,res,next)=>{
    const cart = await cartModel.findOne({ userId: req.user._id });
    let startTimea = req.body.startTime.split(":").map(Number);


    const bookDate=new Date(req.body.bookDate);

    
    if(! req.body.endTime || ! req.body.startTime){
      return next(new Error(`Booking times required`,{cause:404}))
    }
    startTimea = startTimea[0] * 100 + startTimea[1];
   let endTimea = req.body.endTime.split(":").map(Number);
   endTimea = endTimea[0] * 100 + endTimea[1];
   let status="Pending";
    if (!cart || cart.products.length==0)  {
      return next(new Error(`cart is empty`, { cause: 400 }));
    }
   
      if(startTimea >= endTimea){return next(new Error(`not accepted time`,{cause:404}))}
      const user = await userModel.findById(req.user._id);
      if (!req.body.address) {
        req.body.address = user.address;
      }
      if (!req.body.phoneNumber) {
        req.body.phoneNumber = user.phone;
      }
    const checkTime= await bookingModel.findOne({bookDate:new Date(req.body.bookDate)});
    let flag=true;
       if(checkTime){  
    for(let ch of checkTime.Bookingtimes){
      let bookedstartTime = ch.startTime.split(":").map(Number); 
      bookedstartTime= bookedstartTime[0] * 100 + bookedstartTime[1];
     let bookedendTime = ch.endTime.split(":").map(Number);
     bookedendTime = bookedendTime[0] * 100 + bookedendTime[1];
    if((bookedstartTime <= startTimea && bookedendTime >= endTimea) || (bookedstartTime<=startTimea && startTimea<= bookedendTime)|| (startTimea<=bookedstartTime && endTimea>=bookedendTime)){
         flag=false;
         return next(new Error(`This time already booked`,{cause:404}))

    }
    }
    
  if(flag){
    await bookingModel.findOneAndUpdate({bookDate:bookDate},{$push:{Bookingtimes:{startTime:req.body.startTime,endTime: req.body.endTime}}})
    status="Accept"
  }}
   
    if (req.body.couponName) {
      const coupon = await budlescouponModel.findOne({ name: couponName });
      if (!coupon) {
        return next(new Error(`coupon not found`, { cause: 404 }));
      }
      const currentDate =bookDate;
      if (coupon.expireDate < currentDate) {
        return next(new Error(`this coupon has expired`, { cause: 400 }));
      }
      await budlescouponModel.findOneAndUpdate(
        {name:req.body.couponName},
        {$addToSet:{usedBy:req.user._id}},
        {new:true}
      )
    }else{
      let categoriesNum=[];
     for(let ctg of cart.products){
     if(! categoriesNum.includes(ctg.categoryId)){   
         categoriesNum.push(ctg);
        }
     }
     if(categoriesNum.length <=2 && categoriesNum.length<5){
      req.body.couponName="2sBooth";

     } else if(categoriesNum>=5){
      req.body.couponName="5sBooth";
     }
     await budlescouponModel.findOneAndUpdate(
      {name:req.body.couponName},
      {$addToSet:{usedBy:req.user._id}},
      {new:true}
    )
    }
    req.body.products = cart.products;
    let subTotals = 0;
    let finalProductList = [];
    for (let product of req.body.products) {
       const  checkProduct = await productModel.findOne({
        _id: product.productId});
      product = product.toObject();
      product.photounitPrice = checkProduct.PotoPrice;
      product.vidUnitPrice = checkProduct.VideoPrice;
      product.finalPrice = ( checkProduct.PotoPrice * product.photquantity) + (checkProduct.VideoPrice * product.vidquantity);
      subTotals += product.finalPrice;
      finalProductList.push(product);
    }
    let booking;
  if(!checkTime){
    const startTime=req.body.startTime;
    const endTime=req.body.endTime;
    let Bookingtimes=[{startTime,endTime}];
    status="Accept"
    booking = await bookingModel.create({
      userId: req.user._id,
      bookDate:new Date(req.body.bookDate),
      products: finalProductList,
      finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      couponName: req.body.couponName ?? "",
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      paymentType:req.body.paymentType ?? "cash",
      status,
      Bookingtimes
    });
  }else{
    booking = await bookingModel.create({
      userId: req.user._id,
      bookDate:new Date(req.body.bookDate),
      products: finalProductList,
      finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)) / 100,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      couponName: req.body.couponName ?? "",
      startTime:req.body.startTime,
      endTime:req.body.endTime,
      paymentType:req.body.paymentType ?? "cash",
      status,
    });
  }

    if (req.body.coupon) {
      await budlescouponModel.updateOne(
        { _id: req.body.coupon._id },
        { $addToSet: { usedBy: req.user._id } }
      );
    }
    await cartModel.updateOne(
      { userId: req.user._id },
      {
        products: [],
        categoriesId:[]
      }
    );
    return res.status(201).json({ message: "success", booking });
  };
export const cancelBooking=async(req,res,next)=>{
  const { bookingId } = req.params;
  const booking = await bookingModel.findOne({
    _id: bookingId,
    userId: req.user._id,
  });
  if (!booking) {
    return next(new Error(`invalid booking`, { cause: 404 }));
  }
  if (booking.status != "Pending") {
    return next(new Error(`can't cancel this booking`));
  }
  req.body.status = "cancelled";
  req.body.updatedBy = req.user._id;
  await bookingModel.findOneAndUpdate({_id:bookingId},req.body,{new:true});
  if (booking.couponName) {
    await budlescouponModel.updateOne(
      { name: booking.couponName },
      { $pull: { usedBy: req.user._id } }
    );
  }
  return res.json({ message: "success" }); 
};
export const get=async(req,res,next)=>{
  const bookings = await bookingModel.findOne( {userId: req.user._id} );
  return res.status(200).json({ message: "success", bookings });

};
export const getAll=async(req,res,next)=>{
  const bookings = await bookingModel.find({});
  return res.status(200).json({ message: "success", bookings });

};

