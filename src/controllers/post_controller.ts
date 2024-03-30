import {Post} from '../models/postModel';
import Comment from '../models/commentModel';
import Category from '../models/categoryModel';
import User from '../models/userModel';
import { Request, Response } from 'express';
import { Interface } from 'readline';




const createNewPost= async (req:Request,res:Response) => {

    const {content,category} = req.body;
    const user=req.user;
    try {

        const post=await Post.create({
            content,
            userId:user.id,
        })

        const categoryExists:any=await Category.findOne({where:{title:category}})
        if(categoryExists) {
            await categoryExists.addPosts(post)
        }

        else {
            const newCategory:any= await Category.create({
                title:category,
            })
            await newCategory.addPosts(post)
        }

        res.redirect('/posts')
    }

    catch(error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        res.status(400).json(error)
    }
}

const getAllPosts= async (req:Request,res:Response) => {

    await Post.findAll()
    .then(posts => {
        res.render('posts',{posts,currentUser:req.user})
    })
    .catch(error => {
        res.status(500).json(error);
    })

}

const getPostById= async (req:Request,res:Response) => {

    const postId=req.params.postid;
    try {
        const post:any=await Post.findByPk(postId)
        if(!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        const user= await User.findOne({where: {id: post.userId}})
        const comments=await Comment.findAll({where: {postId},include: [{
            model: User,
            attributes: ['firstName','id'],
          }],
        })
        
        res.render('postDetails',{currentUser:req.user,post,user,comments})
    } catch(error) {
        res.status(500).json({ error: 'Internal server error' });

    }

}

const updatePostById= async (req:Request,res:Response) => {

    const postId=req.params.postid;
    const {content} = req.body;
    await Post.findByPk(postId)
    .then ((post:any)=> {
        if(content) {
            post.content=content;
            post.save();
        }
        res.json("Post successfully updated ")
    })
    .catch(error=> {
        // tslint:disable-next-line:no-console
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    })

}

const deletePostById= async (req:Request,res:Response) => {

    const postId=req.params.postid;

    Post.destroy({ where: {id:postId}})
    .then ((post)=> {
        if(!post) {
            res.status(404).json({ error: 'post not found' });
            return;
        }
        res.json({"Post was successfully deleted":post})
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.error('Error finding post:', error);
        res.status(404).json({ error: 'post not found' });
    })

}

const createPostCategory= async (req:Request,res:Response) => {

    const {title} = req.body;
    const postId=req.params.postid;
    let category:any;
    Category.create({
        title,
    })
    .then(async (data) => {
        category=data;
        return await Post.findOne({where: {id: postId}})
    }).then (post=> {
        category.addPosts(post)
        res.json("added successfully")
        return
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error.message);
        res.status(400).json(error.message)
    })
}

const getPostCategories=async (req:Request,res:Response) => {

    const postId=req.params.postid;
    await Post.findByPk(postId, { include: Category})
    .then((post:any) => {
        // tslint:disable-next-line:no-console
        console.log(post);
        const categories:string[]=post.Categories.map((category:any)=> category.title);
        res.json(categories);
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error.message);
        res.status(400).json(error.message)
    })
}

const createPostComment= async (req:Request,res:Response) => {

    const {content} = req.body;
    const postId=req.params.postid;
    const userId=req.user.id;

    await Comment.create({
            content,
            postId,
            userId
         })
    .then(() => {
        res.redirect(`/posts/${postId}`)
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error.message);
        res.status(400).json(error.message)
    })


}

const getPostComments= async (req:Request,res:Response) => {
    // const postId=req.params.postid;
    Post.findByPk(5, { include: Comment})
    .then((post:any) => {
        const comments:string[]=post.Comments.map((comment:any)=>[comment.userId,comment.content]);
        res.json(comments);
    })
    .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error.message);
        res.status(400).json(error.message)
    })

}




export {createNewPost,getAllPosts,getPostById,updatePostById,deletePostById,createPostCategory,
        getPostCategories,createPostComment,getPostComments}