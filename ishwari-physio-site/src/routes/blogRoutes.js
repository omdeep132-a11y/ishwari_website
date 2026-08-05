const express = require('express');
const crypto = require('crypto');
const { readDB, writeDB } = require('../db');
const { requireAdmin } = require('../authMiddleware');

const router = express.Router();

// Public: published posts only, newest first
router.get('/', (req, res) => {
  const db = readDB();
  const posts = db.posts
    .filter(p => p.published)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(posts);
});

// Admin: every post, including unpublished drafts
router.get('/all', requireAdmin, (req, res) => {
  const db = readDB();
  const posts = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(posts);
});

// Admin: create a post
router.post('/', requireAdmin, (req, res) => {
  const { title, category, excerpt, content, image, published } = req.body || {};
  if (!title || !excerpt) {
    return res.status(400).json({ error: 'Title and excerpt are required.' });
  }

  const db = readDB();
  const post = {
    id: crypto.randomUUID(),
    title: String(title).trim(),
    category: category ? String(category).trim() : 'General',
    excerpt: String(excerpt).trim(),
    content: content ? String(content).trim() : '',
    image: image ? String(image).trim() : 'https://picsum.photos/seed/' + Date.now() + '/400/260',
    published: published !== false,
    createdAt: new Date().toISOString()
  };

  db.posts.unshift(post);
  writeDB(db);
  res.status(201).json(post);
});

// Admin: update a post
router.put('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const { title, category, excerpt, content, image, published } = req.body || {};
  if (title !== undefined) post.title = String(title).trim();
  if (category !== undefined) post.category = String(category).trim();
  if (excerpt !== undefined) post.excerpt = String(excerpt).trim();
  if (content !== undefined) post.content = String(content).trim();
  if (image !== undefined) post.image = String(image).trim();
  if (published !== undefined) post.published = !!published;

  writeDB(db);
  res.json(post);
});

// Admin: delete a post
router.delete('/:id', requireAdmin, (req, res) => {
  const db = readDB();
  const before = db.posts.length;
  db.posts = db.posts.filter(p => p.id !== req.params.id);
  if (db.posts.length === before) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  writeDB(db);
  res.json({ ok: true });
});

module.exports = router;
