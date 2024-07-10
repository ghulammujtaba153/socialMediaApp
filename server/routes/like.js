import express from 'express';
import { likePost } from '../controllers/likeController.js';

const likeRouter = express.Router();

likeRouter.post('/:postId', likePost);


export default likeRouter;