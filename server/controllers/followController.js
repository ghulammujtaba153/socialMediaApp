import User from '../models/userSchema.js';

export const followUser = async (req, res) => {
  const { userId, followId } = req.body;

  if (!userId || !followId) {
    return res.status(400).json({ success: false, message: 'User ID and follow ID are required' });
  }

  try {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    user.following.push(followId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    res.status(200).json({ success: true, message: 'Followed user successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followers', 'name email image');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followers = user.followers.map(follower => ({
      _id: follower._id,
      name: follower.name,
      image: follower.image,
    }));

    res.json({ success: true, data: followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getFollowingList = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following', 'name image');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followingList = user.following.map(followedUser => ({
      _id: followedUser._id,
      name: followedUser.name,
      image: followedUser.image,
    }));

    res.status(200).json({ success: true, data: followingList });
  } catch (error) {
    console.error('Error fetching following list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const checkFollowing = async (req, res) => {
  const { userId, followId } = req.query;

  if (!userId || !followId) {
    return res.status(400).json({ success: false, message: 'User ID and follow ID are required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = user.following.includes(followId);
    res.status(200).json({ success: true, following: isFollowing });
  } catch (error) {
    console.error('Error checking following:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const unfollowUser = async (req, res) => {
  const { userId, unfollowId } = req.body;

  if (!userId || !unfollowId) {
    return res.status(400).json({ success: false, message: 'User ID and unfollow ID are required' });
  }

  try {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ success: false, message: 'Not following this user' });
    }

    // Remove unfollowId from user's following array
    user.following = user.following.filter(id => id.toString() !== unfollowId);
    // Remove userId from unfollowUser's followers array
    unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId);

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ success: true, message: 'Unfollowed user successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
