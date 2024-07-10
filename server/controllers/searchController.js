import User from '../models/userSchema.js';

export const searchUsersByName = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query parameter is required' });
  }

  try {
    // Use a case-insensitive regular expression to match names
    const regex = new RegExp(query, 'i');
    const users = await User.find({ name: { $regex: regex } });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
