import express from 'express';
import { searchUsersByName } from '../controllers/searchController.js';

const searchRouter = express.Router();

searchRouter.get('/users', searchUsersByName);

export default searchRouter;
