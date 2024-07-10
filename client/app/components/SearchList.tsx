import apiClient from '@/axios-config';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

interface SearchResult {
  _id: string;
  name: string;
  image: string;
}

interface SearchListProps {
  name: string;
}

const SearchList: React.FC<SearchListProps> = ({ name }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const { user } = useStore();
  const [followingMap, setFollowingMap] = useState<{ [userId: string]: boolean }>({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await apiClient.get(`/api/search/users?query=${name}`);
        if (res.data.success) {
          setResults(res.data.data);
          fetchFollowingStatus(res.data.data);
        } else {
          console.error('Error fetching search results:', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (name) {
      fetchResults();
    }
  }, [name]);

  const fetchFollowingStatus = async (users: SearchResult[]) => {
    const userIds = users.map(user => user._id);
    try {
      const res = await apiClient.post('/api/follow/checkMany', {
        userId: user?._id,
        followIds: userIds
      });

      if (res.data.success) {
        const followingStatus: { [userId: string]: boolean } = {};
        res.data.data.forEach((status: { userId: string, following: boolean }) => {
          followingStatus[status.userId] = status.following;
        });
        setFollowingMap(followingStatus);
      } else {
        console.error('Error fetching following status:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching following status:', error);
    }
  };

  const handleFollow = async (followId: string) => {
    try {
      const res = await apiClient.post('/api/follow/follow', {
        userId: user?._id,
        followId,
      });

      if (res.data.success) {
        toast.success('Followed user successfully');
        updateFollowStatus(followId, true);
      } else {
        toast.error('Error following user');
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (unfollowId: string) => {
    try {
      const res = await apiClient.post('/api/follow/unfollow', {
        userId: user?._id,
        unfollowId,
      });

      if (res.data.success) {
        toast.success('Unfollowed user successfully');
        updateFollowStatus(unfollowId, false);
      } else {
        toast.error('Error unfollowing user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const updateFollowStatus = (userId: string, isFollowing: boolean) => {
    setFollowingMap(prevMap => ({
      ...prevMap,
      [userId]: isFollowing
    }));
  };

  return (
    <div className='w-full m-4 p-1 rounded-lg bg-secondary'>
      <p>Members list "{name}"</p>

      <div className='flex flex-col gap-1'>
        {results.length > 0 ? (
          results.map((user1) => (
            <div  key={user1._id}  className='flex items-center justify-between gap-2 p-2 m-1 rounded-lg shadow-lg bg-font text-white'>
              <a href={`/account/${user1._id}`} className='flex items-center gap-4'>
                <img src={user1.image} alt="/" className='w-[40px] h-[40px] object-cover rounded-full' />
                <p className='font-bold'>{user1.name}</p>
              </a>

              <div
                className='bg-card px-4 rounded-md cursor-pointer'
                onClick={() => followingMap[user1._id] ? handleUnfollow(user1._id) : handleFollow(user1._id)}
              >
                {followingMap[user1._id] ? 'Following' : 'Follow'}
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchList;
