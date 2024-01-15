import joi from "joi";
export const createBooking=joi.object({
    bookDate:joi.date().greater("now").required(),
    startTime: joi.string(),
    endTime:joi.string(),
    phoneNumber:joi.string(),
    status: joi.string().valid("Pending","Done","cancelled","Accept"),
    paymentType: joi.string().valid("cart", "cash"),
    updatedBy: joi.string(),
    productId:joi.string(),   
})