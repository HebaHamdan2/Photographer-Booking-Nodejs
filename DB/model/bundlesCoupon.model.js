import mongoose, { Schema, model, Types } from "mongoose";
const budlescouponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    // ["2sBooth"=> 15% if using more than two Booth"category","5sBooth"=> 25% if using more than five Booth"category","Events&Eids"=> 30% for Eid or events , others ]
    },
  //  BookingId:[{type:Types.ObjectId,ref:"Booking"}],
    amount: { type: Number, required: true },
    usedBy: [{ type: Types.ObjectId, ref: "User" }],
    expireDate: { type: Date},
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    isDeleated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const budlescouponModel = mongoose.models.budlescoupon || model("budlescoupon", budlescouponSchema);
export default budlescouponModel;
