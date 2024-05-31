import mongoose from'mongoose'
import { config } from './config'


const connectDB = async ()=>{
try {
  mongoose.connection.on("connected",()=>{
    console.log("connected to Database  successfully");
    
  })

  mongoose.connection.on('error',(err)=>{
    console.log("Error in connectiong database",err);
    
  })
    await mongoose.connect(config.databaseUrl as string)

} catch (error) {
  console.log("feiled to connect database",error);
  process.exit(1)
}
}

export default connectDB