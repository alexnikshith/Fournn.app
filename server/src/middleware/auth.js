const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fournn_super_secret_jwt_key_2026_change_in_production';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
