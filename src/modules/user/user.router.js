import {Router} from "express"
import * as userController from "./user.controler.js"
import { auth} from "../../middleware/auth.js";
import * as valdators from "./user.validation.js"
import fileUpload, { fileValidation } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { endPoint } from "./user.endPoint.js";
const router=Router();
router.post('/',auth(endPoint.profile),fileUpload(fileValidation.image).single('image'),validation(valdators.profile),asyncHandler(userController.profile));//change profile picture
router.patch("/updatePassword",auth(endPoint.updatePass),validation(valdators.updatePassword),asyncHandler(userController.updatePassword));//update password
router.get("/:id/profile",asyncHandler(userController.shareProfile));//share profile
router.post("/uploadUsersExcel",auth(endPoint.uploadExcel),fileUpload(fileValidation.excel).single('file'),asyncHandler(userController.uploadUserExcel));//read users information from excel
export default router;
 