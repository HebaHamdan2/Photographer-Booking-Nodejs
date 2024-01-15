import {Router} from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";
import * as validators from "./cart.validation.js";
import { endpoint } from "./cart.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
const router=Router();
router.post("/",auth(endpoint.create),validation(validators.createCart),asyncHandler(cartController.createCart));
router.patch("/romveItem",auth(endpoint.delete),asyncHandler(cartController.removeItem));
router.patch("/clear",auth(endpoint.clear),asyncHandler(cartController.clearCart));
router.get("/get",auth(endpoint.get),asyncHandler(cartController.getCart));
router.get("/getAll",auth(endpoint.getAll),asyncHandler(cartController.getAll));
router.delete("/deleteAll",auth(endpoint.delete),asyncHandler(cartController.deleteAll));
router.patch("/deleteSpecific/:cartId",auth(endpoint.delete),asyncHandler(cartController.deleteSpecific));

export default router;