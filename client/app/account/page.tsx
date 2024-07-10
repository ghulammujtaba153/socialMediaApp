'use client'
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import apiClient from '@/axios-config';
import Followers from '../components/Followers';
import { AiOutlineLike } from 'react-icons/ai';
import { Loading } from '../components/Loading';

const AccountPage = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useStore();
  const [loading, setLoading] =useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiClient.get(`/api/post/author/${user._id}`);
        if (res.data.success) {
          setPosts(res.data.data);
        } else {
          console.error('Error fetching posts:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
      setLoading(false);
    };

    if (user?._id) {
      fetchPosts();
      
    }
  }, [user]);

  const handleLikes = async (postId) => {
    try {
      const res = await apiClient.post(`/api/like/${postId}`);
      if (res.data.success) {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      } else {
        console.error('Error liking post:', res.data.message);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
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
        <img src={user?.image} alt="" className='w-[100px] h-[100px] rounded-full cursor-pointer'/>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
      {/* Friends */}
      <div>
        <Followers />
        <div>
          Your Posts
        </div>
      </div>
      {/* Posts */}
      <div className='flex flex-col gap-4 p-3'>
        {posts.map((post) => (
          <div key={post._id} className='flex flex-col bg-card rounded-lg p-3'>
            <div className='flex items-center gap-2 rounded-md p-2'>
              <img src={post.author.image} alt="" className='w-[40px] h-[40px] object-cover rounded-full'/>
              <p className='font-bold'>{post.author.name}</p>
            </div>
            <div className='w-full h-[2px] bg-gray-200'></div>
            <p className='text-wrap'>{post.content}</p>
            {post.image && <img src={post.image} alt="" className="h-[300px] w-[300px] object-cover mt-2 rounded-lg" />}
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

export default AccountPage;
