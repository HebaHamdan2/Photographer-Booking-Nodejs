import {Router} from "express";
import * as AuthController from './auth.controller.js';
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";

const router=Router();

router.post("/signup",fileUpload(fileValidation.image).single("image"),asyncHandler(AuthController.signUp));
router.get("/confirmEmail/:token",asyncHandler(AuthController.confirmEmail));
router.post("/signin",asyncHandler(AuthController.signIn));
router.patch("/sendcode", AuthController.sendCode);
router.patch("/forgetPasseword",asyncHandler(AuthController.forgetPasseword));
router.delete("/invalidConfirm",asyncHandler(AuthController.deleteInvalidConfirm));
export default router;