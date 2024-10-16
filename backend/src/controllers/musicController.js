const User = require('../models/User');
const Track = require('../models/track');

exports.searchMusic = async (req, res) => {
  try {
    const { query } = req.query;
    const tracks = await Track.find({ 
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(tracks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTopItems = async (req, res) => {
  try {
    const { type, timeRange } = req.query;
    const user = await User.findById(req.user.userId);
    
    let pipeline = [
      { $match: { _id: user._id } },
      { $unwind: '$listeningHistory' },
      { $lookup: { from: 'tracks', localField: 'listeningHistory.track', foreignField: '_id', as: 'trackInfo' } },
      { $unwind: '$trackInfo' },
      { $group: { _id: type === 'tracks' ? '$trackInfo._id' : '$trackInfo.artist', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const topItems = await User.aggregate(pipeline);
    res.json(topItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
