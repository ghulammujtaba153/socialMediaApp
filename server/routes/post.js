import express from 'express';
import { createPost, deletePost, getFollowingPosts, getPosts } from '../controllers/postController.js';

const postRouted = express.Router();

postRouted.post('/create', createPost);

postRouted.get('/author/:authorId', getPosts);
postRouted.get('/following/:userId', getFollowingPosts);
postRouted.post('/delete/:id', deletePost);


export default postRouted;