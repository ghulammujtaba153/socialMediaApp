import express from 'express';
import { registerUser, loginUser, googleLogin, registerGoogleUser, checkUser, getUserById } from '../controllers/authController.js';

const authRouted = express.Router();

// Route for user registration
authRouted.post('/register', registerUser);

// Route for user login
authRouted.post('/login', loginUser);

authRouted.post('/user', checkUser);

// Route for Google login
authRouted.post('/google-login', googleLogin);


authRouted.post('/google-register', registerGoogleUser);

authRouted.get('/:id', getUserById);

export default authRouted;
