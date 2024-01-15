import {Router} from "express"
import * as reviewController from "./review.conroller.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./review.endPoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router=Router();
router.post("/:productId",auth(endPoint.create),asyncHandler(reviewController.create));
export default router;