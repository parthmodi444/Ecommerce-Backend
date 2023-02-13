const express=require("Express");
var router = express.Router();

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Crypto=require("crypto-js");
const Order = require("../models/Order");

router.post("/",verifyToken,async (req,res) => {
const newOrder=new Order(req.body);
// console.log(newOrder);
try{
    const savedOrder=await newOrder.save();
    console.log(savedOrder);
    res.send(savedOrder);
}catch(err){
    res.send(err)
}
})
router.put("/:id",verifyTokenAndAdmin, async (req,res) => {
try{
    const updatedOrder=await Order.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
    res.send(updatedOrder); 
    console.log(updatedOrder);  
}
catch(err){
    res.status(500).json(err)
}
})
router.delete("/:id",verifyTokenAndAdmin, async (req,res) => {
try{
await Order.findByIdAndDelete(req.params.id);
res.status(200).json("Order has been deleted");
}catch(err){
    res.status(500).json(err);
}
})
router.get("/find/:id", verifyTokenAndAuthorization,async (req,res) => {
    try{
        const orders=await Order.find({_id:req.params.id});
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
});
router.get("/", verifyTokenAndAdmin,async (req,res) => {
try{
    const orders=await Order.find();
    res.send(orders);

}catch(err){
    res.status(500).json(err);
}
})
router.get("/income",verifyTokenAndAdmin,async (req,res) => {
    const date=new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));
 
 
    try{
        const income = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: prevMonth },
               
              },
            },
            { $project: { month: { $month: '$createdAt' }, sales: '$amount' } },
            {
              $group: {
                _id: '$month',
                total: { $sum: '$sales' },
              },
            },
          ]);
      
    console.log(income);
    res.send(income)
    }catch(err){
        res.status(500).json(err)
    }
})





module.exports=router;