import jwt from "jsonwebtoken";

// Generate jwt token when the function called by the user login
export const generateToken = (payload:any, secret:any) => {

    const token = jwt.sign(payload, secret,{expiresIn: '2 days'});
	return token;
}
