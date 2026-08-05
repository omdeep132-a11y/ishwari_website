const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error('Not admin');
    req.admin = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Session expired, please log in again.' });
  }
}

module.exports = { requireAdmin };
