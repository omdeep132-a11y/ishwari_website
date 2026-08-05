const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { readDB, writeDB, defaultTheme, defaultSiteImages } = require('../db');
const { requireAdmin } = require('../authMiddleware');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed.'));
    }
    cb(null, true);
  }
});

// Public: current theme + site images, used by the public site on load
router.get('/', (req, res) => {
  const db = readDB();
  res.json({
    theme: db.theme || defaultTheme(),
    siteImages: db.siteImages || defaultSiteImages()
  });
});

// Admin: update theme colors
router.put('/theme', requireAdmin, (req, res) => {
  const db = readDB();
  const current = db.theme || defaultTheme();
  const incoming = req.body || {};

  const allowedKeys = Object.keys(defaultTheme());
  const updated = { ...current };
  for (const key of allowedKeys) {
    if (typeof incoming[key] === 'string' && /^#[0-9a-fA-F]{6}$/.test(incoming[key])) {
      updated[key] = incoming[key];
    }
  }

  db.theme = updated;
  writeDB(db);
  res.json(db.theme);
});

// Admin: reset theme to the original defaults
router.post('/theme/reset', requireAdmin, (req, res) => {
  const db = readDB();
  db.theme = defaultTheme();
  writeDB(db);
  res.json(db.theme);
});

// Admin: update hero / about photo URLs (used after uploading via /upload)
router.put('/images', requireAdmin, (req, res) => {
  const db = readDB();
  const current = db.siteImages || defaultSiteImages();
  const { hero, about } = req.body || {};

  if (typeof hero === 'string' && hero.trim()) current.hero = hero.trim();
  if (typeof about === 'string' && about.trim()) current.about = about.trim();

  db.siteImages = current;
  writeDB(db);
  res.json(db.siteImages);
});

// Admin: upload an image file from her device (blog cover, hero photo, about photo...)
router.post('/upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file received.' });
    res.status(201).json({ url: '/uploads/' + req.file.filename });
  });
});

module.exports = router;
