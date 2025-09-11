//import required features 

import validator from 'validator'
import bycrypt from 'bcrypt'
import { createUser } from "../db/userQueries.js";
//import userModel from '../Models/UserModels.js'
import jwt from 'jsonwebtoken'

//Api to Register

const registerUer = async(req,res) => {
    
    try {
        const{name,email,password} = req.body 
        
        //check if any of the property id empty them return response 
        if (!name ||!email || !password ){

           return res.json({success:false,message:"Missing Details"})
        }

        //check if the email is correct then return true and not it will provide false
        if (!validator.isEmail(email)){
             return res.json({success:false,message:"Enter a valid email"})
        }

        //validate the strong password
        if(password.length < 8){
             return res.json({success:false,message:"Enter a strong password"})
        }

        //hashing user passwword
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password,salt)   //save the hashedPasswor in the databases

        //create an object
        const userData = {
            name,
            email,
            password : hashedPassword // not providing the original password but will provide hashed password
        }

        // Save to DB via query layer

        const newUser = await createUser(userData);

        const token = jwt.sign({id:user._id},process)

        return res.json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    }catch (error){


    }
}