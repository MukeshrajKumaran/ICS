const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

//DataBase Connection with MongoDB
mongoose.connect("mongodb+srv://MuRa_gobrr:Muktej28@cluster0.ntjnhdt.mongodb.net/ICS")

//API creation

app.get("/", (req,res)=>{
    res.send("Express App is Running")
})

// Schema creating for User Model
const Users= mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    }
})
//Creating Endpoint for registering the user
app.post('/signup',async(req,res)=>{
    
    let check = await Users.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success:false, errors:"exising user found with same email id or address"})
    }
    let cart = {};
    for(let i=0; i<300; i++){
        cart[i]=0;
    }
    const user= new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ics');
    res.json({success:true,token})
})

//Creating Endpoint for User Login
app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data= {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ics');
            res.json({success:true, token});
        }
        else{
            res.json({success:false,errors: "Wrong Password" });
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port:" +port)
    }
    else
    {
        console.log("Error:" +error)
    }
})