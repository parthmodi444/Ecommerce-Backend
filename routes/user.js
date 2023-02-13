const User=require("../models/User")
const express=require("Express");
const Crypto=require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
var router = express.Router();
router.put("/:id",verifyTokenAndAuthorization, async (req,res) => {
if(req.body.password){
    password=Crypto.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
    console.log(password+"hello");
}
try{
    console.log("hii")
    const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    res.send(updatedUser); 
    console.log(updatedUser)   
}
catch(err){
    res.status(500).json(err)
}
})
router.delete("/:id",verifyTokenAndAuthorization, async (req,res) => {
try{
await User.findByIdAndDelete(req.params.id);
res.status(200).json("User has been deleted");
}catch(err){
    res.status(500).json(err);
}
})
router.get("/find/:id",verifyTokenAndAdmin, async (req,res) => {
    try{
        const user=await User.findById(req.params.id);
        const {password,...others}=user._doc;
        res.status(200).json(others);


    }catch(err){
        res.status(500).json(err)
    }
})
router.get("/",verifyTokenAndAdmin, async (req,res) => {
    const query=req.query.new;
    try{
    const users=query ? await User.find().sort({_id:-1}).limit(1) : await User.find();
    res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
    })

router.get("/stats",verifyTokenAndAdmin, async(req,res) => {
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await(User.aggregate([{$match:{createdAt:{$gte:lastYear}}},
        {
            $project:{
                month:{
                    $month:"$createdAt"
                },
            },
        },
        {
            $group:{
                _id:"$month",
                total:{$sum:1},
            }
        }
        ]))
        res.send(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports=router;