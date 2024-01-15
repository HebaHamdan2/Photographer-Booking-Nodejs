import {Router} from "express";
import * as bookingController from "./booking.controller.js";
import { endPoint } from "./booking.endPoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./booking.validation.js";
import { auth } from "../../middleware/auth.js";
const router=Router();
router.post("/create",auth(endPoint.create),validation(validators.createBooking),asyncHandler(bookingController.createBooking));//create
router.patch("/cancel/:bookingId",auth(endPoint.cancel),asyncHandler(bookingController.cancelBooking));//cancel specific booking
router.get("/get",auth(endPoint.get),asyncHandler(bookingController.get));//get user bookings
router.get("/getAll",auth(endPoint.getAll),asyncHandler(bookingController.getAll))//Admin gets all Bookings
export default router;