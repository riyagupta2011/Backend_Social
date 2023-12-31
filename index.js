const express=require('express');
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const postRoute=require("./routes/posts")
const multer=require("multer")
const path=require("path")
const app=express();

dotenv.config();
app.use(CORS())
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true}).then(()=>{
    console.log("Mongo db connected")
}).catch((err)=>console.log(err));

app.use("/images",express.static(path.join(__dirname,"public/images")));
//middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("common"));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images");
    },
    filename:(req,file,cb)=>{
       cb(null,req.body.name);
    },
});
const upload=multer({storage: storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
   try{
       res.setHeader("Access-Control-Allow-Credentials","true");
      return res.status(200).json("File uploaded successfully")
   } 
   catch(err)
   {
    console.log(err)
   }
}) ;

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);
app.listen(PORT,()=>{
    console.log("backend server is running")
})
