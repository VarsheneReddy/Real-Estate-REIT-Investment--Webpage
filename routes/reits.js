const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [reits] = await db.query('SELECT * FROM reits ORDER BY market_cap DESC');
    res.json(reits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [reits] = await db.query('SELECT * FROM reits WHERE id = ?', [req.params.id]);
    
    if (reits.length === 0) {
      return res.status(404).json({ error: 'REIT not found' });
    }
    
    res.json(reits[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, symbol, price, annual_return, dividend_yield, sector, description, market_cap } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO reits (name, symbol, price, annual_return, dividend_yield, sector, description, market_cap) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, symbol, price, annual_return, dividend_yield, sector, description, market_cap]
    );
    
    res.status(201).json({ message: 'REIT created', reitId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
