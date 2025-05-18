const express = require('express')
const cors = require('cors')
const app = express()
const ProductRouter = require('./routes/product.routes')
// const AuthRoute = require('./routes/auth.routes')
const connectDB = require("./db/connect");


require("dotenv").config()
require('express-async-errors')

app.use(express.json())
app.use(cors())


const port = process.env.PORT || 3002


// app.use("/auth",)

app.use('/product',ProductRouter)
// app.use('/auth',AuthRoute)
const start= async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, ()=>{
            console.log(`server starting on ${port} port`)
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

start();
