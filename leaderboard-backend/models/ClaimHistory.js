const mongoose = require('mongoose');

const claimHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  pointsClaimed: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  previousTotal: {
    type: Number,
    required: true
  },
  newTotal: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClaimHistory', claimHistorySchema);