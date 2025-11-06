const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'dev-secret';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  
  const token = auth.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, SECRET);
    const user = await User.findById(payload.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
