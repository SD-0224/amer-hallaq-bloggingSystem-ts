import User from '../models/userModel';
import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {generateToken} from "../utils/generateToken"

const expiryInterval= 2*24*60*60; // 2 days in seconds

const getAllUsers = async(req:Request,res:Response) => {

    await User.findAll({raw:true})
    .then(users => {
        res.render('users',{users,currentUser:req.user})
    })
    .catch(error => {
        res.status(500).json({ error: 'Database error' });
    })
}


const createNewUser = async (req:Request,res:Response) => {


    const {firstname,lastname, email, password} = req.body;
    // check if the email exists
    const userExists= await User.findOne({where:{email}});
    if(userExists) {
        return res.status(400).send('Email is already associated with an account');
    }
    await User.create({
             firstName:firstname,
             lastName:lastname,
             email,
             password,
         })
    .then(data => {
        // tslint:disable-next-line:no-console
        console.log("user created successfully");
        res.redirect('/');
    })
    .catch(error => {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // tslint:disable-next-line:no-console
            console.error('Error creating user:', 'Email address must be unique');
            res.status(400).json({error:"Email address must be unique"})
          }
        else {
            // tslint:disable-next-line:no-console
            console.log(error.message);
            res.status(400).json(error.message)
        }

    })

}

const showLoginPage= (req:Request,res:Response) => {

    res.render("login",{currentUser:req.user})

}


const loginUser= async (req:Request,res:Response) => {

    const {email,password}=req.body;
    try {
        const currentUser:any=await User.findOne({where:{email}})
        if(!currentUser) {
            return res.status(404).json('Email not found');
        }

        // Verify password
        const ispassValid= await bcrypt.compare(password,currentUser.password)
        if(!ispassValid) {
            return res.status(404).json('Incorrect email and password combination');
        }

        // Authenticate user with jwt
        const token = generateToken({ id:currentUser.id, name:currentUser.firstName},process.env.JWT_SECRETS)
        // tslint:disable-next-line:no-console
        console.log(token);
        // Create a cookie and send token to client
        res.cookie('jwt', token, {httpOnly: true, maxAge: expiryInterval * 1000});
        res.status(201).redirect("/");
    } catch(error) {
        return res.status(500).send('Sign in error');
    }


}

const getUserById = async (req:Request,res:Response) => {

    const userId=req.params.userid;
    const currentUser=req.user;

    let isCurrentUser:boolean=false;
    if(Number(userId)===Number(currentUser.id)) {
        isCurrentUser=true;
    }
    await User.findByPk(userId)
    .then(user => {
        if(!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.render('profile',{user,isCurrentUser,currentUser})
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    })
}


const updateUserById = async (req:Request,res:Response) => {

    const userId=req.params.userid;
    // tslint:disable-next-line:no-console
    console.log(req.body)
    const {firstname,lastname, email} = req.body;
    try {

        const currentUser:any=await User.findByPk(userId);
        if(firstname) {
            currentUser.firstName=firstname;
            currentUser.save();
        }
        if(lastname) {
            currentUser.lastName=lastname;
            currentUser.save();
        }
        if(email) {
            currentUser.email=email;
            currentUser.save();
        }
        // tslint:disable-next-line:no-console
        console.log("Updated Successfully")
        res.redirect(`/users/${currentUser.id}`)
    } catch(error) {
        // tslint:disable-next-line:no-console
        console.log(error)
    }
}


const deleteUserById = async (req:Request,res:Response) => {
    // tslint:disable-next-line:no-console
    console.error('user to be deleted');
    const userId=req.params.userid;
    if(Number(userId)!==Number(req.user.id)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    await User.destroy({ where: {id:userId}})
    .then ((user)=> {
        if(!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({message:"User was successfully deleted"})
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.error('Error finding user:', error);
        res.status(404).json({ error: 'user not found' });
    })
}

const logoutUser = (req:Request, res:Response) => {
    // replacing the current cookie with a blank one that has 1 ms lifetime
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/');
};





export {getAllUsers,createNewUser,getUserById,
        updateUserById,deleteUserById,showLoginPage,loginUser,logoutUser}