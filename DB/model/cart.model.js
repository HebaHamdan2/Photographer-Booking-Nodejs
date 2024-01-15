import mongoose, { Schema, model, Types } from "mongoose";
const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
     products:
     [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        typeOfphotoshoots:{type:String,enum:["photos","videos","Both"],required:true},
        photquantity:{type:Number,default:0},
        vidquantity:{type:Number,default:0},
        categoryId:{type:Types.ObjectId,ref:"Category"}//It's important to offer bundled coupons to verify the number of categories users book
      },
    ]
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel;
