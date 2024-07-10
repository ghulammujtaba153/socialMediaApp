// index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js'; // Ensure the correct path and extension
import authRoutes from './routes/auth.js';
import cors  from 'cors';
import postRouted from './routes/post.js';
import searchRouter from './routes/search.js';
import followRouter from './routes/follow.js';
import likeRouter from './routes/like.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());

// Connect to the database
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/post', postRouted);
app.use('/api/search', searchRouter);
app.use('/api/follow', followRouter);
app.use('/api/like', likeRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
