import express from 'express'

import globalErrorHandler from './middlewares/globalErrorHandler'
import userRouter from './user/userRouter'
import bookRouter from './book/bookRouter'


const app = express()

app.use(express.json())


app.get('/',(req,res,next)=>{
  res.send({message:"Kirankatti"})
})

app.use('/api/users',userRouter)
app.use('/api/books',bookRouter)

// global error handler
app.use(globalErrorHandler)




export default app