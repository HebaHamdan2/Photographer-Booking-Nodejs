import {Router} from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./bundlescoupon.endpoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./bundlescoupon.validation.js"
import { asyncHandler } from "../../services/errorHandling.js";
import * as bundlesCouponController from "./bundlescoupon.controller.js"
const router=Router();
router.post("/",auth(endPoint.create),validation(validators.createCoupon),asyncHandler(bundlesCouponController.createBundlesCoupon));
router.get("/",auth(endPoint.get),asyncHandler(bundlesCouponController.getCoupons));
router.put("/:id",auth(endPoint.update),asyncHandler(bundlesCouponController.updateCoupon));
router.patch("/softDelete/:id",auth(endPoint.delete),asyncHandler(bundlesCouponController.softDelete));
router.delete("/hardDelete/:id",auth(endPoint.delete),asyncHandler(bundlesCouponController.hardDelete));
router.patch("/restore/:id",auth(endPoint.restore),asyncHandler(bundlesCouponController.restoreCoupon));
export default router;