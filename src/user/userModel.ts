import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
  name:{
    type:String,
    retuired:true,
  }, 
   email:{
    type:String,
    retuired:true,
    unique:true
  },
   password:{
    type:String,
    retuired:true,
  }
},{timestamps:true})


export default mongoose.model<User>("User",userSchema)

