const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(auth);

// List user's events
router.get('/', async (req, res) => {
  const events = await Event.find({ owner: req.user._id })
    .sort({ startTime: 1 });
  res.json(events);
});

// Create event
router.post('/', async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  
  // Validation
  if (!title || !startTime || !endTime) {
    return res.status(400).json({ error: 'Title, startTime, and endTime are required' });
  }
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  
  if (end <= start) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }
  
  const event = await Event.create({
    title,
    startTime: start,
    endTime: end,
    status: status || 'BUSY',
    owner: req.user._id
  });
  
  res.status(201).json(event);
});

// Update event (owner only)
router.put('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (!event.owner.equals(req.user._id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Prevent updating if swap is pending
  if (event.status === 'SWAP_PENDING') {
    return res.status(400).json({ error: 'Cannot update event with pending swap' });
  }
  
  // Update allowed fields
  const { title, startTime, endTime, status } = req.body;
  
  if (title) event.title = title;
  if (status && ['BUSY', 'SWAPPABLE'].includes(status)) event.status = status;
  
  if (startTime || endTime) {
    const start = startTime ? new Date(startTime) : event.startTime;
    const end = endTime ? new Date(endTime) : event.endTime;
    
    if (end <= start) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    event.startTime = start;
    event.endTime = end;
  }
  
  await event.save();
  res.json(event);
});

// Delete event
router.delete('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (!event.owner.equals(req.user._id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Prevent deletion if swap is pending
  if (event.status === 'SWAP_PENDING') {
    return res.status(400).json({ error: 'Cannot delete event with pending swap' });
  }
  
  await Event.deleteOne({ _id: event._id });
  res.json({ success: true, message: 'Event deleted' });
});

module.exports = router;
