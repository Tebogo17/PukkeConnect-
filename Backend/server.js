import express from 'express'
import cors from 'cors'
import 'dotenv/config'

//app config
const app = express()
const port = process.env.PORT || 4000


//MIDDLEWARES
app.use(express.json()) //act as the middleware when the request is published  
app.use(cors())       //it allows frontend to connect to backend


//api endpoint
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

//START THE EXPRESS APP
app.listen(port, ()=> console.log("Server Started",port))