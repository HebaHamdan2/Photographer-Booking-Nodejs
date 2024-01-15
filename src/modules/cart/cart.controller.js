import cartModel from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";

export const createCart=async(req,res,next)=>{
    const {productId,typeOfphotoshoot}=req.body;
    const cart=await cartModel.findOne({userId:req.user._id})
    const catg=await productModel.findOne({_id:productId});
    let typeOfphotoshoots=req.body.typeOfphotoshoot;
    if(!catg){return next(new Error(`not valid product Id`,{cause:401}))}
    const categoryId=catg.categoryId;
    if(!cart){
      let vidquantity=0;
    let photquantity=0;
    if(req.body.photquantity){
      photquantity=req.body.photquantity;
    }
    if(req.body.vidquantity){
      vidquantity=req.body.vidquantity;
    }

        const newCart = await cartModel.create({
            userId: req.user._id,
            products:{productId,typeOfphotoshoots,photquantity,vidquantity,categoryId},
          });
          return res.status(201).json({ message: "success",newCart });
         }
         let matchedProduct = false;
         for (let i = 0; i < cart.products.length; i++) {
           if (cart.products[i].productId == productId) {
                    cart.products[i].typeOfphotoshoots=typeOfphotoshoot;
                  
                 if(req.body.photquantity){
                  cart.products[i].photquantity=req.body.photquantity;
                 }
                 if(req.body.vidquantity){
                  cart.products[i].vidquantity=req.body.vidquantity;
                 }
                cart.products[i].categoryId = categoryId;
                matchedProduct = true;
             break;
           }
         }
        ;
      
         if (!matchedProduct) {
              typeOfphotoshoots=req.body.typeOfphotoshoot;
                let photquantity=req.body.photquantity || 0;
                let vidquantity=req.body.vidquantity ||0;
                cart.products.push({productId,typeOfphotoshoots,categoryId,photquantity,vidquantity})
                            
          }

  await cart.save();
  return res.status(201).json({ message: "success", cart });
}
export const removeItem=async(req,res,next)=>{
     const { productId } = req.body;
    await cartModel.updateOne(
      { userId: req.user._id },
      {
        $pull: {
          products: {
            productId,
          },
         
        },

      }
    );


    return res.status(200).json({ message: "success" });
   
}
export const clearCart = async (req, res) => {
    const clearCart = await cartModel.updateOne(
      { userId: req.user._id },
      { products: [] }
    );
    return res.status(200).json({ message: "success" });
  };
export const getCart = async (req, res) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    return res.status(200).json({ message: "success", cart: cart });
  };
  export const getAll=async(req,res,next)=>{
    const allCarts=await cartModel.find({});
    if(!allCarts.length){
      return next(new Error(`No carts to display`),{cause:401});
    }
    return res.status(200).json({message:"success",allCarts});
  }
  export const deleteAll=async(req,res,next)=>{
    const allCarts=await cartModel.find({});
    if(!allCarts.length){
      return next(new Error(`nothing to delete`));
    }
     await cartModel.deleteMany({});
    return res.status(200).json({message:"succsess"});

  }
  export const deleteSpecific=async(req,res,next)=>{
    const id =req.params.cartId;
    const cart= await cartModel.findById(id);
    if(!cart){
    return next(new Error(`no cart with this Id`));
    }
    await cartModel.findByIdAndDelete(id);
    return res.status(200).json({message:"success"});
    

  }