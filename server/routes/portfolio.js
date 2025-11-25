const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const [portfolio] = await db.query(
      `SELECT p.*, r.name, r.symbol, r.price as current_price, r.sector
       FROM portfolio p
       JOIN reits r ON p.reit_id = r.id
       WHERE p.user_id = ?`,
      [req.params.userId]
    );
    
    const portfolioWithStats = portfolio.map(item => ({
      ...item,
      invested_amount: item.shares * item.avg_price,
      current_value: item.shares * item.current_price,
      profit_loss: (item.shares * item.current_price) - (item.shares * item.avg_price),
      profit_loss_percent: ((item.current_price - item.avg_price) / item.avg_price * 100).toFixed(2)
    }));
    
    res.json(portfolioWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/invest', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { userId, reitId, shares, price } = req.body;
    const totalAmount = shares * price;
    
    const [users] = await connection.query('SELECT balance FROM users WHERE id = ?', [userId]);
    
    if (users[0].balance < totalAmount) {
      await connection.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    await connection.query(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [totalAmount, userId]
    );
    
    const [existing] = await connection.query(
      'SELECT * FROM portfolio WHERE user_id = ? AND reit_id = ?',
      [userId, reitId]
    );
    
    if (existing.length > 0) {
      const newShares = parseFloat(existing[0].shares) + parseFloat(shares);
      const newAvgPrice = ((existing[0].shares * existing[0].avg_price) + (shares * price)) / newShares;
      
      await connection.query(
        'UPDATE portfolio SET shares = ?, avg_price = ? WHERE user_id = ? AND reit_id = ?',
        [newShares, newAvgPrice, userId, reitId]
      );
    } else {
      await connection.query(
        'INSERT INTO portfolio (user_id, reit_id, shares, avg_price) VALUES (?, ?, ?, ?)',
        [userId, reitId, shares, price]
      );
    }
    
    await connection.query(
      'INSERT INTO transactions (user_id, reit_id, type, shares, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, reitId, 'BUY', shares, price, totalAmount]
    );
    
    await connection.commit();
    
    const [updatedUser] = await connection.query('SELECT balance FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'Investment successful', balance: updatedUser[0].balance });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

router.get('/transactions/:userId', authMiddleware, async (req, res) => {
  try {
    const [transactions] = await db.query(
      `SELECT t.*, r.name, r.symbol
       FROM transactions t
       JOIN reits r ON t.reit_id = r.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC
       LIMIT 50`,
      [req.params.userId]
    );
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
