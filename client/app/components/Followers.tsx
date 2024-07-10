'use client'
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import apiClient from '@/axios-config';
import toast from 'react-hot-toast';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const { user } = useStore();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await apiClient.get(`/api/follow/${user._id}`);
        if (res.data.success) {
          setFollowers(res.data.data);
        } else {
          console.error('Error fetching followers:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    if (user?._id) {
      fetchFollowers();
    }
  }, [user]);

  return (
    <div className="bg-secondary w-full m-2 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Followers</h2>
      <div className="flex flex-col gap-4 p-3">
        {followers.map((follower) => (
          <div key={follower._id} className="flex items-center gap-4 p-2 bg-card rounded-lg">
            <img src={follower.image} alt={follower.name} className="w-[40px] h-[40px] object-cover rounded-full" />
            <div>
              <p className="font-bold">{follower.name}</p>
              <p className="text-sm">{follower.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followers;
