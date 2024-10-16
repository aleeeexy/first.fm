const User = require('../models/User');
const Track = require('../models/track');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate({
        path: 'listeningHistory.track',
        model: Track
      });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user profile' });
  }
};
