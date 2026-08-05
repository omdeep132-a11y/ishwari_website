const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB } = require('../db');
const { requireAdmin } = require('../authMiddleware');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  // secure: true, // enable this once the site is served over HTTPS
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDB();
  const admin = db.admin;

  if (!admin || admin.email !== String(email).toLowerCase().trim()) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const ok = bcrypt.compareSync(password, admin.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ email: admin.email, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('admin_token', token, COOKIE_OPTIONS);
  res.json({ email: admin.email });
});

router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ email: req.admin.email });
});

module.exports = router;
