require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const blogRoutes = require('./routes/blogRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { readDB, writeDB } = require('./db');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Make sure the db file + admin account exist even if `npm run seed` wasn't run yet.
const db = readDB();
if (!db.admin) {
  console.warn('No admin account found yet - run "npm run seed" to create one from your .env file.');
}

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/settings', settingsRoutes);

// Serve the public website and the admin panel
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Site running at        http://localhost:${PORT}`);
  console.log(`Admin panel running at http://localhost:${PORT}/admin`);
});
