const router = require('express').Router();
const User = require("../models/UserModels");
const bcrypt = require('bcrypt');

// REGISTER

router.post("/register" ,async (req , res) =>{
    try{
        const isExistUser = await User.findOne({username : req.body.username});
        if(isExistUser){
            res.status(400).json({type : 'error' , message : "User Name Already Exists"})
        }
        else{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password , salt)
            const newUser = new User(req.body);
            const user = await newUser.save();

            const { password , ...others } = user._doc

            res.status(200).json({type : 'success' , message : `${user.firstname} Saved Successfully` , data : others})
        }
    } catch(err){
        res.status(500).json(err)
    }
});


// LOGIN

router.post("/login" , async (req , res) =>{
    try {
        const user = await User.findOne({ username : req.body.username });

        if(!user){
            return res.status(400).json({type : 'error' , message : 'Invalid Username'})
        }

        const password = await bcrypt.compare(req.body.password , user.password);
        if(!password){
            return res.status(400).json({type : 'error' , message : 'Invalid Password'})
        }

        return res.status(200).json({type : 'success' , message : `${user.firstname} Logged in Successful` , id : user._id})

    } catch (error) {
        res.status(500).json(err)
    }
})



// GET

router.get("/" , async (req , res) =>{

    const thisUserQuery = req.query.user;
    let users;

    try{
        if(thisUserQuery){
            users = await User.find({ firstname : thisUserQuery });
        }
        else{
            users = await User.find();            
        }
        res.status(200).json(users)
    } catch(err){
        res.status(500).json(err)
    }
});

// GET BY ID

router.get("/:id" , async (req , res) =>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)
    }
});


// DELETE

router.delete("/:id" , async (req , res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({type : 'success' , message : `${user.firstname} Deleted Successfully`})
    } catch(err){
        res.status(500).json(err)
    }
});


// UPDATE

router.put("/:id" , async (req , res) =>{
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id , {
            $set : req.body
        },{new : true});
        res.status(200).json(({type : 'success' , message : `${updateUser.firstname} Updated Successfully` , data : updateUser}))
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router