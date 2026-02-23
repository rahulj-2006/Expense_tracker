const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize, User } = require('./models');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/admin', adminRoutes);

// START SERVER
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Sync database + Auto create admin
    await sequelize.sync();
    console.log("Database synced.");

    const admin = await User.findOne({ where: { username: 'rahul' } });

    if (!admin) {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash('admin123', 10);

      await User.create({
        username: 'rahul',
        password: hashed,
        role: 'admin',
        email: 'rahul@example.com'
      });

      console.log("Admin created: rahul / admin123");
    } else {
      console.log("Admin exists.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
