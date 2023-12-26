import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createSubcategory=async(req,res,next)=>{
const {name,categoryId}=req.body;
const subcategory=await subcategoryModel.findOne({name});
if(subcategory){
    return next(new Error(`sub category ${name} already exists`,{cause:409}));
}
const category=await categoryModel.findById(categoryId);
if(!category){
    return next(new Error(`category ot found`,{cause:409}));
}
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
folder:`${process.env.APP_NAME}/subcategories`
})
const subCategory=await subcategoryModel.create({name,slug:slugify(name),categoryId,image:{secure_url,public_id}})
return res.status(201).json({message:"success",subCategory});
}
export const getSubcategories=async(req,res,next)=>{
const categoryId=req.params.categoryId;
const category=await categoryModel.findById(categoryId);
if(!category){
    return next(new Error(`category not found`,{cause:404}));
}
const subcategories=await subcategoryModel.find({categoryId}).populate({path:'categoryId'})
return res.status(200).json({message:"success",subcategories})
}
export const updateSubcategory=async(req,res,next)=>{
    const subcategory=await subcategoryModel.findById(req.params.Id);
    if(!subcategory){
        return next(new Error(`Invalid subcategory id ${req.params.Id}`,{cause:404}))
    }
    if (
        await subcategoryModel
          .findOne({ name: req.body.name, _id: { $ne: req.params.Id } })
          .select("name")
      ) {
        return next(
          new Error(`subcategory ${req.body.name} already exists`, { status: 409 })
        );
      }
      subcategory.name = req.body.name;
      subcategory.slug = slugify(req.body.name);
      subcategory.status = req.body.status;
    
      if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: `${process.env.APP_NAME}/subcategory`,
          }
        );
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image = { secure_url, public_id };
      }
      subcategory.updatedBy = req.user._id;
      await subcategory.save();
      return res.status(200).json({ message: "success" });
}
export const deletesubCategory=async(req,res,next)=>{
const id=req.params.Id;
const subcategory=await subcategoryModel.findByIdAndDelete(id);
if(!subcategory){
    return next(new Error(`subcategory not found`,{cause:404}))
}
return res.status(200).json({message:"success"});
}