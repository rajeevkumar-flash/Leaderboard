const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users with rankings
router.get('/', async (req, res) => {
  try {
    // Get all users sorted by points in descending order
    const users = await User.find().sort({ totalPoints: -1 });
    
    // Assign ranks
    users.forEach((user, index) => {
      user.rank = index + 1;
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name });
    await user.save();
    
    // Update rankings
    await updateRankings();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to update rankings
async function updateRankings() {
  const users = await User.find().sort({ totalPoints: -1 });
  
  for (let i = 0; i < users.length; i++) {
    users[i].rank = i + 1;
    await users[i].save();
  }
}

module.exports = router;