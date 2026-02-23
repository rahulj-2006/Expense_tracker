const sequelize = require('../config/db');

const User = require('./user')(sequelize);
const Expense = require('./expense')(sequelize);
const OTP = require('./otp')(sequelize);

// Associations
User.hasMany(Expense, { foreignKey: 'user_id' });
Expense.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Expense, OTP };
