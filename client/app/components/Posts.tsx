'use client';
import apiClient from '@/axios-config';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { IoMdAttach } from 'react-icons/io';
import upload from '../utils/uploadWidget';
import toast from 'react-hot-toast';
import { AiOutlineLike } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import { Loading } from './Loading';

const Posts = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const { user } = useStore();
  const [image, setImage] = useState("");
  const [loading, setLoading]=useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiClient.get(`/api/post/author/${user._id}`);
        const followingRes = await apiClient.get(`/api/post/following/${user._id}`);
        console.log(followingRes.data);

        if (res.data.success && followingRes.data.success) {
          setPosts([...res.data.data, ...followingRes.data.data]);
        } else {
          console.error('Error fetching posts:', res.data.message || followingRes.data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
      setLoading(false)
    };

    if (user?._id) {
      fetchPosts();
    }
  }, [user]);

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const url = await upload(file);
        setImage(url);
        toast.success('Image uploaded successfully');
        console.log('Image uploaded', url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleAttachClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(content, user._id, image);
    try {
      const res = await apiClient.post('/api/post/create', {
        content,
        author: user._id,
        image
      });

      if (res.data.success) {
        setPosts([res.data.data, ...posts]);
        setContent('');
        setImage(''); // Reset image after submission
        console.log('Post created:', res.data.data);
      } else {
        console.error('Error creating post:', res.data.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikes = async (id) => {
    try {
      const res = await apiClient.post(`/api/like/${id}`);
      if (res.data.success) {
        setPosts(posts.map(post => post._id === id ? { ...post, likes: post.likes + 1 } : post));
        console.log('Post liked:', res.data.data);
      } else {
        console.error('Error liking post:', res.data.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiClient.post(`/api/post/delete/${id}`, {
        userId: user._id
      });
      if (res.data.success) {
        setPosts(posts.filter(post => post._id !== id));
        toast.success('Post deleted successfully');
        console.log('Post deleted:', res.data.data);
      } else {
        console.error('Error deleting post:', res.data.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  

  return (
    <>  
    {
      loading?
      <Loading/>
      :

      <div className="bg-secondary w-full m-2 rounded-lg">
      <form onSubmit={handleSubmit} className="flex gap-1 items-center m-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-md h-10"
          placeholder="What's on your mind?"
        />
        <button
          type="button"
          onClick={handleAttachClick}
          className='hover:bg-purple-500 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
        >
          <IoMdAttach />
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" className="bg-card p-2 rounded-md text-white cursor-pointer">
          Submit
        </button>
      </form>
      <div className="flex flex-col gap-4 p-3">
        {posts.map((post) => (
          <div key={post._id} className="flex flex-col bg-card rounded-lg p-3">
            <div className="flex items-center justify-between gap-2 rounded-md p-2">
              <div className="flex items-center gap-2">
                <img src={post.author.image || user.image} alt="" className="w-[40px] h-[40px] object-cover rounded-full" />
                <p className="font-bold">{post.author.name}</p>
              </div>
              <p className="font-bold text-xs">{new Date(post.createdAt).toISOString().split('T')[0]}</p>
            </div>
            <div className="w-full h-[2px] bg-gray-200"></div>
            <p className="text-wrap">{post.content}</p>
            {post.image && <img src={post.image} alt="" className="h-[300px] w-[300px] object-cover mt-2 rounded-lg" />}
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <div
                  onClick={() => handleLikes(post._id)}
                  className='hover:bg-purple-500 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                >
                  <AiOutlineLike />
                </div>
                {post.likes}
              </div>
              {post.author._id === user._id && (
                <div
                  onClick={() => handleDelete(post._id)}
                  className='hover:bg-red-500 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
                >
                  <MdOutlineDelete />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    }


    
    </>
    
  );
};

export default Posts;
