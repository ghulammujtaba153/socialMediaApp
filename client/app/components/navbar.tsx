'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import { getUserIdFromToken } from '../utils/jwtUtils';
import apiClient from '@/axios-config';

const Navbar = () => {
  const [press, setPress] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setUser, clearUser } = useStore();
  const [userId, setUserId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const id = getUserIdFromToken(token);
          setUserId(id);
          if (id) {
            try {
              const response = await apiClient.get(`/api/auth/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setUser(response.data); 
              
            } catch (error) {
              console.error('Error fetching user:', error);
            }
          }
        }
      };

      fetchUserData();
    }
  }, [setUser]);

  useEffect(() => {
    if (session?.user) {
      const { id, name, email, image } = session.user;
      setUser({ id, name, email, image });
    }
  }, [session, setUser]);

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const handleSignOut = () => {
    clearUser();
    localStorage.removeItem('token');
    router.push("/login")
    nextAuthSignOut({ callbackUrl: '/login' }); // Adjust the callback URL as needed
  };

  return (
    <div className='flex justify-center items-center py-2 bg-secondary'>
      <div className='flex justify-between items-center w-[1200px] px-2'>
        <div>
          <a className='font-extrabold text-lg' href='/'><img src='pic-logo.png' className="w-[50px] h-[50px] rounded-full"/></a>
        </div>
        <div className='flex items-center gap-2'>
          <form onSubmit={handleSearch} className='flex items-center'>
            <input
              type="search"
              placeholder='Find Friends'
              className='rounded-sm p-2 outline-none'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className='bg-white p-3'><FaSearch /></button>
          </form>
          {!user?.name && (
            <a href="/login" className='text-white bg-card p-2 rounded-sm px-4'>Login</a>
          )}
          <div>
            {user?.image && (
              <img
                src={user.image}
                onClick={() => setPress(!press)}
                alt='User Avatar'
                className='w-[50px] h-[50px] rounded-full cursor-pointer'
              />
            )}
            {press && (
              <div className='absolute bg-white rounded-md mt-1 cursor-pointer'>
                <a href='/account' className='hover:bg-cyan-50 w-full p-2 rounded-md'>
                  Account
                </a>
                <div className='hover:bg-cyan-50 w-full p-2 rounded-md' onClick={handleSignOut}>
                  Sign out
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
