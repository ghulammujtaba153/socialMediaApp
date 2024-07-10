// controllers/likeController.js

import Post from "../models/postSchema.js";


export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
