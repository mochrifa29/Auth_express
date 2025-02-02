import mongoose from "mongoose";
import validator from "validator"
const {Schema} = mongoose

const userSchema = new Schema({
   name : {
    type : String,
    required : [true,'Username Harus Diisi'],
    minlength : [3,"Username minimal 3 karakter"]
   },
   email : {
    type : String,
    required : [true,'Email Harus Diisi'],
    validate : {
        validator : validator.isEmail,
        message : "Inputan harus berformat Email"
    },
    unique:true
   },
   password : {
    type : String,
    required : [true,"Password Harus Diisi"],
    minlength : [6,"Password minimal 6 karakter"]
   },
   role : {
    type : String,
    enum : ["user","admin"],
    default : "user"
   },
   isVerified : {
    type : Boolean,
    default: false
   },
   emailVerifiedAt : {
    type : Date
   }
  });

  const User = mongoose.model("User",userSchema)
  export default User;