import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import subcategoryModel from "../../../DB/model/subcategory.model.js";
import { pagination } from "../../services/pagination.js";
import productModel from "../../../DB/model/product.model.js";
import cloudinary from "../../services/cloudinary.js";
export const createProduct=async(req,res,next)=>{
const{name,categoryId,subcategoryId,discount}=req.body;
let PotoPrice=0;
let VideoPrice=0;
if(req.body.PotoPrice){
  PotoPrice=req.body.PotoPrice;
}
if(req.body.VideoPrice){
  PotoPrice=req.body.VideoPrice;
}
  const checkCategory = await categoryModel.findById(categoryId);
  if (!checkCategory) {
return next(new Error(`category not found`,{cause:404})) 
}
const checksubCategory = await subcategoryModel.findById(subcategoryId);
  if (!checksubCategory) {
    return next(new Error(`subcategory not found`,{cause:404})) 
}
req.body.slug = slugify(name);
req.body.finalPrice = ((PotoPrice  - (PotoPrice  * (discount || 0)) / 100).toFixed(2)) + (VideoPrice - ((VideoPrice * discount /100)));
const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: `${process.env.APP_NAME}/product/${req.body.name}/mainImage` }
  );
  
  req.body.mainImage = { public_id, secure_url };
  req.body.subImages = [];
  for (const file of req.files.subImages) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
    );
    req.body.subImages.push({ public_id, secure_url });
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error(`error while creating product`,{cause:400})) 
  }
  return res.status(201).json({ message: "success", product });
};

export const getProducts= async(req,res,next)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);

    let queryObj={...req.body};
    const execQuery=['page','limit','skip','sort','search'];
    execQuery.map((ele)=>{
  delete queryObj[ele];

});
queryObj=JSON.stringify(queryObj);
queryObj=queryObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,match=>`$${match}`);
queryObj=JSON.parse(queryObj);
const mongooseQuery=productModel.find(queryObj).limit(limit).skip(skip);
if(req.query.search){
  mongooseQuery.find({
    $or:[
      {name:{$regx:req.query.search,$options:'i'}},
      {description:{$regx:req.query.search,$option:'i'}},
    ]
  })
  mongooseQuery.select('name mainImage');
}

const products=await mongooseQuery.sort(req.query.sort?.replaceAll(',',' '));
const count=await productModel.estimatedDocumentCount();
return res.json({message:"success",page:products.length,total:count,products});
};
export const getProductWithCategory = async (req, res,next) => {
  const products = await productModel.find({
    categoryId: req.params.categoryId,
  });
  return res.status(200).json({ message: "success", products });
};
export const getProduct = async (req, res) => {
  const product = await productModel.findById(req.params.productId);
  return res.status(200).json({ message: "success", product });
};
export const deleteProduct=async(req,res,next)=>{
  const product = await productModel.findById( req.params.productId);
   if(!product){
return next(new Error(`This product does not exist`));
   }
   await productModel.findByIdAndDelete(req.params.productId);
   return res.status(200).json({message:"success"});

};
export const updateProduct=async(req,res,next)=>{
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(
      new Error(`invalid product id ${req.params.id}`, { status: 404 })
    );
  }
  if (
    await productModel
      .findOne({ name: req.body.name, _id: { $ne: product._id } })
      .select("name")
  ) {
    return next(
      new Error(`product ${req.body.name} already exists`, { status: 409 })
    );
  }
  if(req.body.name){
    product.name = req.body.name;
    product.slug = slugify(req.body.name);
  }
  
  if(req.body.status){product.status = req.body.status;}
  product.updatedBy = req.user._id;
  await product.save();
  return res.status(200).json({ message: "success" });
};
export const getReviews=async(req,res,next)=>{
  const product=await productModel.findById(req.params.productId).populate('review');
  return res.status(200).json({message:"success",product});
}