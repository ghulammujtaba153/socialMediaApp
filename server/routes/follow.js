import express from 'express';
import { checkFollowing, followUser, getFollowers, getFollowingList, unfollowUser } from '../controllers/followController.js';
const followRouter = express.Router();

followRouter.post('/follow', followUser);
followRouter.get('/:userId', getFollowers);
followRouter.get('/:userId/following', getFollowingList);
followRouter.get('/check', checkFollowing);
followRouter.post('/unfollow', unfollowUser);


export default followRouter;
