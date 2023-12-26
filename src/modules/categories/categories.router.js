import {Router} from "express";
import * as categoriesController from "./categories.controller.js";
import subCategoryRouter from "./../subcategory/subcategory.router.js"
import fileUpload,{fileValidation} from "../../services/multer.js";
import {auth} from "../../middleware/auth.js";
import {validation} from "../../middleware/validation.js"
import * as validators from "./categories.validation.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { endPoint } from "./categories.endPoint.js";
const router=Router();
router.use("/:id/subcategory",subCategoryRouter);
router.post("/",auth(endPoint.create),fileUpload(fileValidation.image).single("image"), validation(validators.createCategory),asyncHandler(categoriesController.createCategory))//create
router.get("/",asyncHandler(categoriesController.getCategories))//read
router.get("/:id",validation(validators.getSpecificCategory),asyncHandler(categoriesController.SpecificCategory))//read
router.put("/:id",auth(endPoint.update),fileUpload(fileValidation.image).single("image"),asyncHandler(categoriesController.updateCategory));//update
router.delete("/:categoryId",auth(endPoint.delete),asyncHandler(categoriesController.deleteCategory));//delete

export default router;
