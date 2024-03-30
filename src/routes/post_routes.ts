import express from "express"
import {createNewPost,getAllPosts,getPostById,updatePostById,deletePostById,createPostCategory,
        getPostCategories,createPostComment,getPostComments} from "../controllers/post_controller"
import {isAuthorized} from "../middleware/isAuthorized"
const router=express.Router();

router.post('/posts',[isAuthorized],createNewPost);
router.get('/posts',[isAuthorized],getAllPosts);
router.get('/posts/:postid',[isAuthorized],getPostById);
router.get('/posts/update/:postid',[isAuthorized],updatePostById);
router.get('/posts/delete/:postid',[isAuthorized],deletePostById);
router.post('/posts/:postid/categories',[isAuthorized],createPostCategory);
router.get('/posts/:postid/categories',[isAuthorized],getPostCategories);
router.post('/posts/:postid/comments',[isAuthorized],createPostComment);
router.get('/posts/:postid/comments',[isAuthorized],getPostComments);


export default router;