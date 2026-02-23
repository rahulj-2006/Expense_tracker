const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
};
