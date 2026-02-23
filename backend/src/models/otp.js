const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'OTP',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      otp: { type: DataTypes.STRING, allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false }
    },
    {
      tableName: 'otps',
      timestamps: true,
      createdAt: 'created_at'
    }
  );
};
