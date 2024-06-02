import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import { error } from "console";

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
      const error = createHttpError(400,"User already exist with this email")
      return next(error)
    }
    
  } catch (error) {
    return next(createHttpError(500,"Error While getting user"))
  }



  // password --> hash
let newUser:User
try {
  const hashedPassword = await bcrypt.hash(password,10)
  newUser =await  userModel.create({
      name,email, password: hashedPassword 
    })
    
  } catch (error) {
    return next(createHttpError(500,"Error while creating user"))
  }

  //token generation
  try {
    const token = sign({sub:newUser._id}, config.jwtSecret as string,{expiresIn:"7d",algorithm:"HS256"})
  
  
    // response 
    res.status(201).json({accessToken:token})
    
  } catch (error) {
    return next(createHttpError(500,"Error While signin JWT TOken"))
  }
}

// login user
const loginUser = async (req:Request,res:Response,next:NextFunction)=>{
  const {email,password} = req.body

  if(!email || !password){
    return next(createHttpError(400,"All fields ar required"))
  }
  
  let user:User |  null;
  try { 
      user = await userModel.findOne({email})
    if(!user){
      return next(createHttpError(404,"User Not Found"))
    }
  }
 catch (error) {
    return next(createHttpError(500,"Error while getting loginuser"))
  }


  // Compare passwords
  try {
    console.log("Comparing passwords:", { plainPassword: password, hashedPassword: user.password });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Username or Password incorrect"));
    }

    // Create access token
    try {
      const token = sign({ sub: user._id }, config.jwtSecret as string, {
        expiresIn: "7d",
        algorithm: "HS256"
      });

      res.json({ accessToken: token });
    } catch (tokenError) {
      console.error("JWT Token error:", tokenError);
      return next(createHttpError(500, "Error while signing JWT token"));
    }
  } catch (compareError) {
    console.error("Password comparison error:", compareError);
    return next(createHttpError(500, "Error while comparing passwords"));
  }



}


export {createUser,loginUser}