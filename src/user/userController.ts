import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{

  const {name,email,password} = req.body;


  // validation
  if(!name || !email || !password){
    
    const error= createHttpError(400,"All Fields are required")


    return next(error)
  }

  // database call
  try {
    const user = await userModel.findOne({email}) 
    if(user){
      const error = createHttpError(400,"User already exist with this emai;")
      return next(error)
    }
    
  } catch (error) {
    return next(createHttpError(500,"Error While getting user"))
  }



  // password --> hash
let newUser:User
  const hashedPassword = await bcrypt.hash(password,10)
  try {
      newUser =await  userModel.create({
      name,email,hashedPassword
    })
    
  } catch (error) {
    return next(createHttpError(500,"Error while creating user"))
  }

  //token generation
  try {
    const token = sign({sub:newUser._id}, config.jwtSecret as string,{expiresIn:"7d",algorithm:"HS256"})
  
  
    // response 
    res.json({accessToken:token})
    
  } catch (error) {
    return next(createHttpError(500,"Error While signin JWT TOken"))
  }
}


export {createUser}