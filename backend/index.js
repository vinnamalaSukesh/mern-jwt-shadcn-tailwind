const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors({origin : 'http://localhost:5173'}))
app.use(cookieParser())

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('DB connected'))
    .catch((err)=>console.log(err))

const task = mongoose.Schema({
    Name : {type : String,required : true},
    Phone : {type : String,required : true},
    Notes : {type : String,required : true},
    Status : {type : String,default : 'unassigned',enum:['Not assigned','Not started','In progess','Struck in error','Completed']}
})
const agent = mongoose.Schema({
    Name : {type : String,required : true},
    email : {type : String,required : true},
    Phone : {type : String,required : true},
    pwd : {type : String,required : true},
    tasks : [task]
})
const admin = mongoose.Schema({
    Name : {type : String,unique : true,required : true},
    email : {type : String,unique : true,required : true},
    pwd : {type : String,required : true},
    agents : [agent],
    tasks : [task],
})
const Admin = mongoose.model('admins',admin)

app.post('/',async(req,res)=>{
    try{
        const {token} = req.body
        jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
            if(err){
                return res.status(400).json({message : "Token verification failed"})
            }
            const {admin,agent} = decoded
            const user = await Admin.findOne({email : admin})
            if(!user){
                return res.status(400).json({message : "Token verification failed"})
            }
            if(agent == null){
                return res.status(200).json({message : "Token verified",uname:user.Name,email:user.email,role:'Admin',agents:user.agents,tasks:user.tasks})
            }
            const details = user.agents.find((agent_)=> agent_.email === agent)
            if(!details){
                return res.status(400).json({message : "Token verification failed"})
            }
            return res.status(200).json({message : "token verification success",agent : details,role:'Agent'})
        })
    }
    catch(err){
        return res.status(500).json({message : "Internal server error"})
    }
})
app.post('/Login',async(req,res)=>{
    try {
        const { admin, email, pwd } = req.body
        if(admin === ""){
            const user = await Admin.findOne({ email: email })
            const match = await bcrypt.compare(pwd,user.pwd)
            if(!match){
                return res.status(400).json({message : "Details not match"})
            }
            const token = await jwt.sign({ admin: email, agent: null }, process.env.JWT_SECRET,{expiresIn : '1d'})
            return res.status(200).json({message : "Login success",token : token})
        }
        else{
            const admin = await Admin.findOne({email : admin})
            const agent = admin.agents.find((agent)=>agent.email === email)
            const match = await bcrypt.compare(agent.pwd,pwd)
            if(!match){
                return res.status(400).json({ message: "Details not match" })
            }
            const token = await jwt.sign({ admin: admin, agent: email }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return res.status(200).json({ message: "Login success", token: token })
        }
    }
    catch (err) {
        return res.status(500).json({message : "Internal server error"})
    }
})
app.post('/Register',async(req,res)=>{
    try{
    const {uname, email, pwd} = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(pwd,salt)
    const user = await new Admin({Name : uname,email : email,pwd : hashedPwd}).save()
    if(!user){
        return res.status(400).json({message : "Error in registering"})
    }
    return res.status(200).json({message : "Successfully registered"})
    }
    catch(err){
        return res.status(500).json({message : "internal server error"})
    }
})
app.listen(3000)