import { Request, Response } from 'express';
import { getPostById } from '../src/controllers/post_controller'
import User from '../src/models/userModel'; 
import Comment from '../src/models/commentModel'; 
import {Post} from '../src/models/postModel'; 
import {jest} from '@jest/globals';
import sequelize from '../src/config/db';

jest.useFakeTimers()

describe('getPostById', () => {
    test('should return 404 if post is not found', async () => {
        const req = { params: { postId: 'non-existing-id' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        await getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    test('should return post details with user and comments', async () => {
        const postId = 'existing-post-id';
        const req = { params: { postId } } as unknown as Request;
        const res = { render: jest.fn() } as unknown as Response;

        const postMock = { userId: 'user-id' };
        const userMock = { id: 'user-id', firstName: 'John' };
        const commentsMock = [{ id: 'comment-id', postId, userId: 'user-id' }];

        jest.spyOn(Post, 'findByPk').mockResolvedValue(postMock as any);
        jest.spyOn(User, 'findOne').mockResolvedValue(userMock as any);
        jest.spyOn(Comment, 'findAll').mockResolvedValue(commentsMock as any);

        await getPostById(req, res);

        expect(res.render).toHaveBeenCalledWith('postDetails', { currentUser: undefined, post: postMock, user: userMock, comments: commentsMock });
    });

    test('should return 500 for internal server error', async () => {
        const req = { params: { postId: 'existing-post-id' } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

        jest.spyOn(Post, 'findByPk').mockRejectedValue(new Error('Some error'));

        await getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});