const express=require("Express");
var router = express.Router();

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Crypto=require("crypto-js");
const Cart = require("../models/Cart");
router.post("/",verifyToken,async (req,res) => {
const newCart=new Cart(req.body);
console.log(newCart);
try{
    const savedCart=await Cart.save();
    res.status(200).json(savedCart);
}catch(err){
    res.send(err)
}
})
router.put("/:id",verifyTokenAndAuthorization, async (req,res) => {
try{
    const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.send(updatedCart); 
    console.log(updatedCart);  
}
catch(err){
    res.status(500).json(err)
}
})
router.delete("/:id",verifyTokenAndAuthorization, async (req,res) => {
try{
await Cart.findByIdAndDelete(req.params.id);
res.status(200).json("Product has been deleted");
}catch(err){
    res.status(500).json(err);
}
})
router.get("/find/:id", verifyTokenAndAuthorization,async (req,res) => {
    try{
        const cart=await Cart.findOne({_id:req.params.id});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err)
    }
});
router.get("/", verifyTokenAndAdmin,async (req,res) => {
try{
    const carts=await Cart.find();
    res.send(carts);

}catch(err){
    res.status(500).json(err);
}
     })





module.exports=router;