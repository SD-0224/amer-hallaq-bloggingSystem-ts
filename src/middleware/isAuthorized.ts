import dotenv from "dotenv";
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {

    const token= req.cookies.jwt;
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const secretKey:any=process.env.JWT_SECRETS
    jwt.verify(token,secretKey,async(err:any,decoded:any)=>{

        if(err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findByPk(decoded.id);
        req.user=user;
        next();

    })

}

// Check current user
export const isCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  const secretKey:any=process.env.JWT_SECRETS
  if (token) {
    jwt.verify(token, secretKey, async (err:any, decoded:any) => {
      if (err) {
        req.user=null;
        next();
      } else {
        const user = await User.findByPk(decoded.id);
        req.user = user;
        next();
      }
    });
  } else {
    req.user = null;
    next();
  }
};

