const express = require('express');
const crypto = require('crypto');
const { readDB, writeDB } = require('../db');
const { requireAdmin } = require('../authMiddleware');

const router = express.Router();

// Public: someone submits the "Request Appointment" form on the site
router.post('/', (req, res) => {
  const { name, phone, email, message } = req.body || {};

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone and email are required.' });
  }

  const db = readDB();
  const booking = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    message: message ? String(message).trim() : '',
    status: 'new', // new | contacted | done
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(booking);
  writeDB(db);

  res.status(201).json({ ok: true });
});

// Admin: list all bookings/messages
router.get('/', requireAdmin, (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

// Admin: update a booking's status
router.patch('/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const allowed = ['new', 'contacted', 'done'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'status must be one of ' + allowed.join(', ') });
  }

  const db = readDB();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });

  booking.status = status;
  writeDB(db);
  res.json(booking);
});

// Admin: delete a booking
router.delete('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const before = db.bookings.length;
  db.bookings = db.bookings.filter(b => b.id !== req.params.id);
  if (db.bookings.length === before) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  writeDB(db);
  res.json({ ok: true });
});

module.exports = router;
