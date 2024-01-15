import mongoose, { Schema, model, Types } from "mongoose";
const BookingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookDate:{type:Date,default:Date.now(),required:true},// yyyy-mm-dd
    startTime:{type:String},//hh:mm
    endTime:{type:String},//hh:mm
    Bookingtimes:[{
      startTime:{type:String},
      endTime:{type:String}
    }],
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        typeOfphotoshoots:{type:String,enum:["photos","videos","Both"],required:true},
        vidquantity:{type:Number ,default:0},
        photquantity:{type:Number,default:0},
        photounitPrice:{type:Number,default:5},
        vidUnitPrice:{type:Number,default:3},
        finalPrice: { type: Number, required: true },
        categoryId:{type:Types.ObjectId,ref:"Category"}
      },
    ],
    finalPrice: {
      type: Number,
      required: true,
    },
    address: { type: String},
    phoneNumber: { type: String },
    couponName: {
      type: String
    },
    paymentType: {
      type: String,
      default: "cash",
      enum: ["cart", "cash"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Accept","Pending", "cancelled", "Done"],
    },
    reasonRejected: String,
    note: String,
    updatedBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.models.Booking || model("Booking", BookingSchema);
export default bookingModel;
