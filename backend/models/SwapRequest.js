const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  mySlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  theirSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ recipient: 1, status: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
