'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import apiClient from '@/axios-config';
import { AiOutlineLike } from 'react-icons/ai';
import { Loading } from '@/app/components/Loading';

const AccountDetails = () => {
  const { id } = useParams(); // Extracting id from the router params
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading]=useState(true)

  useEffect(() => {
    console.log(id)
    if (id) {
      const fetchUserDetails = async () => {
        try {
          const res = await apiClient.get(`/api/auth/${id}`);
          setUserDetails(res.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      const fetchUserPosts = async () => {
        try {
          const res = await apiClient.get(`/api/post/author/${id}`);
          console.log(res.data)
          setPosts(res.data.data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
        setLoading(false)
      };

      fetchUserDetails();
      fetchUserPosts();
    }
  }, [id]);

  const handleLikes = async (postId) => {
    // Handle post like functionality
  };

  

  return (
    <>
    {
        loading?
        <Loading/>
        :
        <div className='flex flex-col bg-secondary max-w-[1200px] gap-4 mx-auto m-4 rounded-md shadow-lg p-2'>
      {/* Account Details */}
      <div className='flex flex-col justify-center items-center'>
        <img src={userDetails.image} alt={userDetails.name} className='w-[100px] h-[100px] rounded-full cursor-pointer'/>
        <p>{userDetails.name}</p>
        <p>{userDetails.email}</p>
      </div>
      {/* Friends */}
      <div>
        {/* Implement Followers Component */}
        <div>
          Posts
        </div>
      </div>
      {/* Posts */}
      <div className='flex flex-col gap-4 p-3'>
        {posts.map((post) => (
          <div key={post._id} className='flex flex-col bg-card rounded-lg p-3'>
            <div className='flex items-center gap-2 rounded-md p-2'>
              <img src={post.author.image} alt={post.author.name} className='w-[40px] h-[40px] object-cover rounded-full'/>
              <p className='font-bold'>{post.author.name}</p>
            </div>
            <div className='w-full h-[2px] bg-gray-200'></div>
            <p className='text-wrap'>{post.content}</p>
            {post.image && <img src={post.image} alt={post.content} className="h-[300px] w-[300px] object-cover mt-2 rounded-lg" />}
            <div className='flex items-center'>
              <div
                onClick={() => handleLikes(post._id)}
                className='hover:bg-purple-500 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <AiOutlineLike />
              </div>
              {post.likes}
            </div>
          </div>
        ))}
      </div>
    </div>

    }
    
    </>
    
  );
};

export default AccountDetails;
