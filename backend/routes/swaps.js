const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/authMiddleware');
const { notifyUser } = require('../socket');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get swappable slots (exclude current user's)
router.get('/swappable-slots', async (req, res) => {
  const slots = await Event.find({
    status: 'SWAPPABLE',
    owner: { $ne: req.user._id }
  })
    .populate('owner', 'name email')
    .sort({ startTime: 1 });
  
  res.json(slots);
});

// Create swap request
router.post('/swap-request', async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  
  if (!mySlotId || !theirSlotId) {
    return res.status(400).json({ error: 'Missing slot ids' });
  }
  
  // Fetch slots
  const [mySlot, theirSlot] = await Promise.all([
    Event.findById(mySlotId),
    Event.findById(theirSlotId)
  ]);
  
  if (!mySlot || !theirSlot) {
    return res.status(404).json({ error: 'Slots not found' });
  }
  
  // Validate ownership and statuses
  if (!mySlot.owner.equals(req.user._id)) {
    return res.status(403).json({ error: 'You must own mySlot' });
  }
  
  if (mySlot.status !== 'SWAPPABLE') {
    return res.status(400).json({ error: 'Your slot must be SWAPPABLE' });
  }
  
  if (theirSlot.status !== 'SWAPPABLE') {
    return res.status(400).json({ error: 'Target slot must be SWAPPABLE' });
  }
  
  if (theirSlot.owner.equals(req.user._id)) {
    return res.status(400).json({ error: 'Cannot request your own slot' });
  }
  
  // Check for existing pending request for these slots
  const existingRequest = await SwapRequest.findOne({
    $or: [
      { mySlot: mySlot._id, status: 'PENDING' },
      { theirSlot: mySlot._id, status: 'PENDING' },
      { mySlot: theirSlot._id, status: 'PENDING' },
      { theirSlot: theirSlot._id, status: 'PENDING' }
    ]
  });
  
  if (existingRequest) {
    return res.status(400).json({ error: 'One or both slots already have a pending swap request' });
  }
  
  // Transaction: create SwapRequest + set both slots to SWAP_PENDING
  // Check if transactions are supported (requires replica set)
  let session = null;
  const useTransactions = mongoose.connection.readyState === 1 && 
                          mongoose.connection.db && 
                          mongoose.connection.db.topology && 
                          mongoose.connection.db.topology.description.type !== 'Single';
  
  try {
    if (useTransactions) {
      session = await mongoose.startSession();
      session.startTransaction();
    }
    
    // Create swap request
    let swap;
    const swapData = {
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      requester: req.user._id,
      recipient: theirSlot.owner,
      status: 'PENDING'
    };
    
    if (useTransactions) {
      const result = await SwapRequest.create([swapData], { session });
      swap = result[0];
    } else {
      swap = await SwapRequest.create(swapData);
    }
    
    // Update both slots to SWAP_PENDING
    await Event.updateMany(
      { _id: { $in: [mySlot._id, theirSlot._id] } },
      { $set: { status: 'SWAP_PENDING' } },
      useTransactions ? { session } : {}
    );
    
    if (useTransactions) {
      await session.commitTransaction();
    }
    
    // Populate for response
    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('mySlot theirSlot requester recipient');
    
    // Send real-time notification to recipient
    notifyUser(theirSlot.owner.toString(), 'swapRequestReceived', {
      swapRequest: populatedSwap,
      message: `${req.user.name} wants to swap slots with you!`
    });
    
    res.status(201).json({ swap: populatedSwap });
  } catch (err) {
    if (useTransactions && session) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    if (useTransactions && session) {
      session.endSession();
    }
  }
});

// Respond to swap request
router.post('/swap-response/:requestId', async (req, res) => {
  const { accept } = req.body;
  const reqId = req.params.requestId;
  
  if (typeof accept !== 'boolean') {
    return res.status(400).json({ error: 'accept must be boolean' });
  }
  
  // Fetch swap request
  const swapReq = await SwapRequest.findById(reqId);
  
  if (!swapReq) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  if (!swapReq.recipient.equals(req.user._id)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  if (swapReq.status !== 'PENDING') {
    return res.status(400).json({ error: 'Request is not pending' });
  }
  
  // Check if transactions are supported
  let session = null;
  const useTransactions = mongoose.connection.readyState === 1 && 
                          mongoose.connection.db && 
                          mongoose.connection.db.topology && 
                          mongoose.connection.db.topology.description.type !== 'Single';
  
  try {
    if (useTransactions) {
      session = await mongoose.startSession();
      session.startTransaction();
    }
    
    const mySlot = useTransactions 
      ? await Event.findById(swapReq.mySlot).session(session)
      : await Event.findById(swapReq.mySlot);
    const theirSlot = useTransactions
      ? await Event.findById(swapReq.theirSlot).session(session)
      : await Event.findById(swapReq.theirSlot);
    
    if (!mySlot || !theirSlot) {
      // Cleanup: mark request rejected
      swapReq.status = 'REJECTED';
      await swapReq.save(useTransactions ? { session } : {});
      
      if (mySlot) {
        mySlot.status = 'SWAPPABLE';
        await mySlot.save(useTransactions ? { session } : {});
      }
      if (theirSlot) {
        theirSlot.status = 'SWAPPABLE';
        await theirSlot.save(useTransactions ? { session } : {});
      }
      
      if (useTransactions) {
        await session.commitTransaction();
      }
      return res.status(500).json({ error: 'Slots not found during response' });
    }
    
    if (!accept) {
      // Reject: restore both slots to SWAPPABLE
      swapReq.status = 'REJECTED';
      await swapReq.save(useTransactions ? { session } : {});
      
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      
      await mySlot.save(useTransactions ? { session } : {});
      await theirSlot.save(useTransactions ? { session } : {});
      
      if (useTransactions) {
        await session.commitTransaction();
      }
      
      // Send real-time notification to requester
      notifyUser(swapReq.requester.toString(), 'swapRequestRejected', {
        swapRequestId: swapReq._id,
        message: `Your swap request was rejected`
      });
      
      return res.json({ success: true, message: 'Swap request rejected' });
    }
    
    // Accept: exchange owners and set statuses to BUSY
    const tempOwner = mySlot.owner;
    mySlot.owner = theirSlot.owner;
    theirSlot.owner = tempOwner;
    
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';
    
    await mySlot.save(useTransactions ? { session } : {});
    await theirSlot.save(useTransactions ? { session } : {});
    
    swapReq.status = 'ACCEPTED';
    await swapReq.save(useTransactions ? { session } : {});
    
    if (useTransactions) {
      await session.commitTransaction();
    }
    
    const populatedSwap = await SwapRequest.findById(swapReq._id)
      .populate('mySlot theirSlot requester recipient');
    
    // Send real-time notification to requester
    notifyUser(swapReq.requester.toString(), 'swapRequestAccepted', {
      swapRequest: populatedSwap,
      message: `Your swap request was accepted!`
    });
    
    res.json({ success: true, message: 'Swap accepted', swap: populatedSwap });
  } catch (err) {
    if (useTransactions && session) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    if (useTransactions && session) {
      session.endSession();
    }
  }
});

// Get incoming swap requests
router.get('/swap-requests/incoming', async (req, res) => {
  const list = await SwapRequest.find({ recipient: req.user._id })
    .populate('mySlot theirSlot requester recipient')
    .sort({ createdAt: -1 });
  
  res.json(list);
});

// Get outgoing swap requests
router.get('/swap-requests/outgoing', async (req, res) => {
  const list = await SwapRequest.find({ requester: req.user._id })
    .populate('mySlot theirSlot requester recipient')
    .sort({ createdAt: -1 });
  
  res.json(list);
});

module.exports = router;
