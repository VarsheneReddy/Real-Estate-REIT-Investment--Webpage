const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [posts] = await db.query(
      `SELECT cp.*, u.username
       FROM community_posts cp
       JOIN users u ON cp.user_id = u.id
       ORDER BY cp.created_at DESC
       LIMIT 100`
    );
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO community_posts (user_id, content) VALUES (?, ?)',
      [userId, content]
    );
    
    res.status(201).json({ message: 'Post created', postId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
