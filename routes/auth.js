const express=require("Express");
var router = express.Router();
const User=require("../models/User");
const Crypto=require("crypto-js");
const jwt=require("jsonwebtoken");

router.post("/register", async(req,res) => {
    const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:Crypto.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()

    })
    try{
        const savedUser=await newUser.save();
        res.send(savedUser);
    }
    catch(err){
        res.status(500).json(err)
    }
})
router.post("/login",async (req,res) => {
try{
const user=await User.findOne({username:req.body.username});
!user && res.status(401).json("Wrong credentials");
const hashedPassword=Crypto.AES.decrypt(user.password,process.env.PASS_SEC);
const Originalpassword=hashedPassword.toString(Crypto.enc.Utf8);
Originalpassword!==req.body.password && res.status(401).json("Wrong credentials");
const accessToken=jwt.sign({
    id:user._id,
    isAdmin:user.isAdmin
},process.env.JWT_SEC,{expiresIn:"29d"})
console.log(accessToken);
const {password,...others}=user._doc;
res.json(others);
}
catch(err){
    res.status(500).json(err);
}
})

module.exports=router;