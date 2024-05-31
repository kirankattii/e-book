import express from 'express'

import globalErrorHandler from './middlewares/globalErrorHandler'


const app = express()

app.get('/',(req,res,next)=>{
  res.send({message:"Kirankatti"})
})

// global error handler

app.use(globalErrorHandler)




export default app