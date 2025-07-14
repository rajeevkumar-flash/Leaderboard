const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

// Claim points for a user
router.post('/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate random points (1-10)
    const pointsClaimed = Math.floor(Math.random() * 10) + 1;
    const previousTotal = user.totalPoints;
    const newTotal = previousTotal + pointsClaimed;
    
    // Update user's total points
    user.totalPoints = newTotal;
    await user.save();
    
    // Create claim history record
    const claimHistory = new ClaimHistory({
      userId: user._id,
      userName: user.name,
      pointsClaimed,
      previousTotal,
      newTotal
    });
    await claimHistory.save();
    
    // Update all rankings
    await updateRankings();
    
    // Get updated user with new rank
    const updatedUser = await User.findById(userId);
    
    res.json({
      user: updatedUser,
      pointsClaimed,
      claimHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get claim history
router.get('/history', async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .sort({ claimedAt: -1 })
      .limit(50); // Last 50 claims
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get claim history for specific user
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await ClaimHistory.find({ userId: req.params.userId })
      .sort({ claimedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
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