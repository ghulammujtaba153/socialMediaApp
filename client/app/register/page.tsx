'use client';
// RegisterPage.tsx

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import apiClient from './../../axios-config';
import upload from '../utils/uploadWidget';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const [picLoading, setPicLoading] = useState(false);

  const handleProfilePictureChange = async (e) => {
    setPicLoading(true);
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const url = await upload(e.target.files[0]);
          setImage(url);
          console.log("image uploaded", url);
          resolve('Image uploaded successfully');
        } catch (error) {
          console.error('Error uploading image:', error);
          reject('Failed to upload image');
        } finally {
          setPicLoading(false);
        }
      }),
      {
        loading: 'Uploading image...',
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await apiClient.post('/api/auth/register', {
            name,
            email,
            password,
            image
          });
          console.log('Registration successful!', response.data);
          resolve('Registration successful!');
          router.push('/login');
        } catch (error) {
          console.error('Error during registration:', error);
          reject('Error during registration');
        }
      }),
      {
        loading: 'Registering...',
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  const handleGoogleSubmit = async (e: any) => {
    e.preventDefault();
    signIn('google');

    try {
      const response = await apiClient.post('/api/auth/google-register', {
        name: session?.user?.name,
        email: session?.user?.email,
        password: '',
        image: session?.user?.image,
      });

      console.log('Registration successful!', response.data);
      // Example: Redirect to a different page

    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className='flex bg-background h-screen justify-center items-center'>
      <div className='flex w-[320px] bg-secondary flex-col p-11 rounded-lg shadow-lg gap-4'>
        <input
          type="text"
          placeholder='Enter name'
          className='rounded-sm py-2'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder='Enter email'
          className='rounded-sm py-2'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='Enter password'
          className='rounded-sm py-2'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="file"
          name='image'
          accept="image/*"
          onChange={handleProfilePictureChange} />
        {picLoading && <p>Uploading image...</p>}
        <button onClick={handleSubmit} className='bg-card rounded-lg cursor-pointer py-2 px-1'>
          Submit
        </button>
        <div className='flex justify-center text-center text-white'>or</div>
        <div onClick={handleGoogleSubmit} className='bg-white py-2 rounded-lg flex justify-center items-center gap-2 cursor-pointer'>
          <img src="google.jpg" alt="G" className='w-[40px] h-[40px] object-cover' />
          Continue with Google
        </div>
        <p className='text-sm'>
          Already have an account? <a href="/login" className='text-font'>Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
