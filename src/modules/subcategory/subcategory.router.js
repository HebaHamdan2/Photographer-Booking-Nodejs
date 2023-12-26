import {Router} from "express";
import * as subcategoryController from "./subcategory.controller.js"
import fileUpload, { fileValidation } from "../../services/multer.js";
import { endPoint } from "./subcategory.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router =Router({mergeParams:true});
router.post("/",auth(endPoint.create),fileUpload(fileValidation.image).single('image'),asyncHandler(subcategoryController.createSubcategory));//create
router.get("/:categoryId",asyncHandler(subcategoryController.getSubcategories));//read
router.put('/:Id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(subcategoryController.updateSubcategory));//update
router.delete("/:Id",auth(endPoint.delete),asyncHandler(subcategoryController.deletesubCategory));//delete
export default router;