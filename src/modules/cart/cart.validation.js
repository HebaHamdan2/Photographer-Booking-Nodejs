import joi from "joi"
export const createCart=joi.object({
    userId:joi.string(),
    productId:joi.string().required(),
    typeOfphotoshoot:joi.string().required(),
    photquantity:joi.number(),
    vidquantity:joi.number(),
  
})
