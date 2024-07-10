import Post from '../models/postSchema.js';
import User from '../models/userSchema.js';

export const createPost = async (req, res) => {
  try {
    const { content, author,image } = req.body;

    if (!content || !author) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newPost = await Post.create({ content, author,image });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPosts = async (req, res) => {
  const { authorId } = req.params;

  if (!authorId) {
    return res.status(400).json({ success: false, error: 'Author not found' });
  }

  try {
    const posts = await Post.find({ author: authorId }).populate('author').exec();
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getFollowingPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followingIds = user.following.map(follow => follow._id);
    const posts = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/post/:id
// POST /api/post/delete/:id
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findByIdAndDelete(id);
 // Ensure 'post' is an instance of a Mongoose model
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

