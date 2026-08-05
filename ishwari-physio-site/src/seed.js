// Run with `npm run seed`.
// Creates/resets the admin account (from .env) and adds starter blog posts,
// without wiping out any bookings/posts that already exist.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { readDB, writeDB, defaultTheme, defaultSiteImages } = require('./db');

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('ADMIN_EMAIL / ADMIN_PASSWORD missing from .env');
  process.exit(1);
}

const db = readDB();

const passwordHash = bcrypt.hashSync(password, 10);
db.admin = { email: email.toLowerCase().trim(), passwordHash };

if (!db.posts || db.posts.length === 0) {
  db.posts = [
    {
      id: 'p1',
      title: '5 Desk Stretches to Save Your Back',
      category: 'Posture',
      excerpt: 'Small habit changes that make a big difference for desk workers.',
      content: 'Full article coming soon.',
      image: 'https://picsum.photos/seed/blog1physio/400/260',
      published: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2',
      title: 'Understanding Rehab Timelines',
      category: 'Recovery',
      excerpt: 'What to realistically expect after an injury, week by week.',
      content: 'Full article coming soon.',
      image: 'https://picsum.photos/seed/blog2physio/400/260',
      published: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p3',
      title: 'Warm-Ups That Actually Prevent Injury',
      category: 'Sports',
      excerpt: 'The science-backed way to prep your body before activity.',
      content: 'Full article coming soon.',
      image: 'https://picsum.photos/seed/blog3physio/400/260',
      published: true,
      createdAt: new Date().toISOString()
    }
  ];
}

if (!db.bookings) db.bookings = [];
if (!db.theme) db.theme = defaultTheme();
if (!db.siteImages) db.siteImages = defaultSiteImages();

writeDB(db);

console.log('Admin account ready:');
console.log('  email:', db.admin.email);
console.log('  password: (the one set in .env - not stored in plain text)');
