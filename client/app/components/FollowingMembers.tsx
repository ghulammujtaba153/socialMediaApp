"use client"
import React, { useEffect, useState } from 'react';
import apiClient from '@/axios-config';
import { useStore } from '../store/useStore';

const FollowingMembers = () => {
  const { user } = useStore();
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await apiClient.get(`/api/follow/${user?._id}/following`);
        if (res.data.success) {
          setFollowingList(res.data.data);
        } else {
          console.error('Error fetching following list:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching following list:', error);
      }
    };

    if (user?._id) {
      fetchFollowing();
    }
  }, [user?._id]); // Dependency array should include user?._id

  return (
    <div className='w-[300px] m-4 p-1 rounded-lg bg-secondary'>
      <p>Following</p>
      <div className='flex flex-col gap-1'>
        {followingList.length > 0 ? (
          followingList.map(member => (
            <div key={member._id} className='flex items-center gap-2 p-2 m-1 rounded-lg shadow-lg bg-font text-white'>
              <img src={member.image} alt={member.name} className='w-[40px] h-[40px] object-cover rounded-full'/>
              <p className='font-bold'>{member.name}</p>
            </div>
          ))
        ) : (
          <p>No members followed yet.</p>
        )}
      </div>
    </div>
  );
};

export default FollowingMembers;
