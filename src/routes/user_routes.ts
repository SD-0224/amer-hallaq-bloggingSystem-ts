import express from "express"
import {getAllUsers,createNewUser,getUserById,updateUserById,deleteUserById,showLoginPage,loginUser,logoutUser} from "../controllers/user_controller"
import {isAuthorized} from "../middleware/isAuthorized"
const router=express.Router();

router.get('/users',[isAuthorized],getAllUsers);
router.get('/login',showLoginPage);
router.post('/login',loginUser);
router.post('/users',createNewUser);
router.get('/users/:userid',[isAuthorized],getUserById);
router.post('/users/update/:userid',[isAuthorized],updateUserById);
router.get('/users/delete/:userid',[isAuthorized],deleteUserById);
router.get('/logout',[isAuthorized],logoutUser)


export default router;