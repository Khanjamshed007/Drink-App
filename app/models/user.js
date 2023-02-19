const mongoose = require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR=path.join('/upload/avatar')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    avatar:{type:String},
    role:{type:String,default:'customer'}
},{timestamps:true});

let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',AVATAR));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '_' + Date.now())
    }
});

// static method
const maxsize=10*1024*1024//10mb
userSchema.statics.uploadedAvatar=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        if(
            file.mimetype=="image/png"||
            file.mimetype=="image/jpg" ||
            file.mimetype=="image/jpeg" ||
            file.mimetype=="image/gif" 
        ){
            cb(null,true)
        }else{
            cb(null,false);
            return cb(new Error("only jpg,png and jpeg format"))
        }
    },
    limits:{
        fileSize:maxsize
    }
}).single('avatar');
userSchema.statics.avatarPath=AVATAR;
module.exports = mongoose.model('User', userSchema);