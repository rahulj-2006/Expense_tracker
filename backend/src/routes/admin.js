const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const { Expense, User } = require('../models');

// Admin: get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'role', 'created_at']
  });
  res.json(users);
});

// Admin: get all expenses
router.get('/expenses', auth, adminOnly, async (req, res) => {
  const expenses = await Expense.findAll({
    include: [{ model: User, attributes: ['username'] }],
    order: [['created_at', 'DESC']]
  });
  res.json(expenses);
});

module.exports = router;
