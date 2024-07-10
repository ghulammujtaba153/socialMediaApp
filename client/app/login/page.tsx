'use client';

import apiClient from '@/axios-config';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [emailL, setEmailL] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(emailL);

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const response = await apiClient.post('/api/auth/login', {
            email: emailL,
            password,
          });

          const { token, user } = response.data;

          // Store token in local storage
          localStorage.setItem('token', token);

          console.log('Login successful!', response.data);

          // Update Zustand store with user data
          setUser(user);

          // Redirect to home page
          router.push('/');
          resolve('Login successful!');
        } catch (error) {
          console.error('Error during login:', error);
          reject('Error during login');
        }
      }),
      {
        loading: 'Logging in...',
        success: (message) => message,
        error: (message) => message,
      }
    );
  };

  return (
    <div className='flex bg-background h-screen justify-center items-center'>
      <div className='flex w-[320px] bg-secondary flex-col p-11 rounded-lg shadow-lg gap-4'>
        <input
          type="email"
          placeholder='Enter email'
          className='rounded-sm py-2'
          value={emailL}
          onChange={(e) => setEmailL(e.target.value)}
        />
        <input
          type="password"
          placeholder='Enter password'
          className='rounded-sm py-2'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className='bg-card rounded-lg cursor-pointer py-2 px-1'
          onClick={handleSubmit}
        >
          Submit
        </button>
        <div className='flex justify-center text-center text-white'>or</div>
        <div
          onClick={() => signIn('google')}
          className='bg-white py-2 rounded-lg flex justify-center items-center gap-2 cursor-pointer'
        >
          <img src="google.jpg" alt="G" className='w-[40px] h-[40px] object-cover' />
          Continue with Google
        </div>
        <p className='text-sm'>
          Don't have an account? <a href="/register" className='text-font'>Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
