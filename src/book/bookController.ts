import { NextFunction, Request, Response } from "express";
import path from "path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";


const createBook =  async(req:Request,res:Response,next:NextFunction)=>{
  // const {} = req.body;
console.log("files",req.files);

const files =  req.files as {[fileName:string]:Express.Multer.File[]}

const coverImageMineType = files.coverImage[0].mimetype.split('/').at(-1);

const fileName = files.coverImage[0].filename

const filePath = path.resolve(__dirname,"../../public/data/uploads",fileName)


try {
  const uploadResult = await cloudinary.uploader.upload(filePath,{
  filename_override:fileName,
  folder:'book-covers',
  format:coverImageMineType,
})


const bookFileName = files.file[0].filename

const bookFilePath = path.resolve(__dirname,"../../public/data/uploads",bookFileName)


  
  const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
    resource_type:"raw",
    filename_override:bookFileName,
    folder:"book-pdfs",
    format:"pdf"
  })
  console.log("bookFileUploadResult",bookFileUploadResult);
  console.log("uploadresult",uploadResult);
  res.json()
  
} catch (error) {

  console.log(error);
  return next(createHttpError(500,"error while uploading images"))
  
}




}
export {createBook}