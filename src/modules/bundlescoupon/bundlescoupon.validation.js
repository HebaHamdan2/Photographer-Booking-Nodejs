import joi from "joi";
export const createCoupon = joi.object({
  name: joi.string().required(),
  amount: joi.number().positive(),
  expireDate: joi.date().greater("now")
});
