const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Expense, sequelize } = require('../models');
const { Op } = require('sequelize');

// Add expense
router.post('/', auth, async (req, res) => {
  const { name, amount, category } = req.body;

  const exp = await Expense.create({
    user_id: req.user.id,
    name,
    amount,
    category
  });

  res.json(exp);
});

// Get expenses (with optional ?month=YYYY-MM)
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query;
    const where = { user_id: req.user.id };

    if (month) {
      const start = new Date(month + "-01T00:00:00Z");
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
      }
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      where.created_at = {
        [Op.gte]: start,
        [Op.lt]: end
      };
    }

    const expenses = await Expense.findAll({
      where,
      order: [["created_at", "DESC"]]
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error: error.message });
  }
});

// Summary API
router.get('/summary', auth, async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: "Month parameter is required (YYYY-MM)" });
    }

    const start = new Date(month + "-01T00:00:00Z");
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });
    }
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const [results] = await sequelize.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
         AND created_at >= ?
         AND created_at < ?
       GROUP BY category`,
      { replacements: [req.user.id, start, end] }
    );

    const total = results.reduce((sum, r) => sum + parseFloat(r.total), 0);

    res.json({ month, total, breakdown: results });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary", error: error.message });
  }
});

module.exports = router;
