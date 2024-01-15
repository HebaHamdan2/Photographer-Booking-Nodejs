import {Router} from "express"
import * as productsController from "./products.controller.js"
import * as validators from "./products.validation.js"
import { asyncHandler } from "../../services/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./products.endPoint.js";
import { validation } from "../../middleware/validation.js";
import fileUpload, { fileValidation } from "../../services/multer.js";

const router=Router();

router.post(
    "/",
    auth(endPoint.create),
    fileUpload(fileValidation.image).fields([
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 4 },
    ]),
    validation(validators.createProduct), asyncHandler(productsController.createProduct)
  );//create
router.get("/",asyncHandler(productsController.getProducts));//read all products
router.get("/category/:categoryId", asyncHandler(productsController.getProductWithCategory));//get product for a specific category
router.get("/:productId",asyncHandler(productsController.getProduct));//get a specific product from it is id
router.delete("/:productId",auth(endPoint.delete),asyncHandler(productsController.deleteProduct));//delete
router.put("/:id",auth(endPoint.update),asyncHandler(productsController.updateProduct));//update  textual information for product
router.post("/:productId",asyncHandler(productsController.getReviews));
export default router;