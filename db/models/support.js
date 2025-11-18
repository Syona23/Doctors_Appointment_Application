const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Support = sequelize.define('Support', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'open' }
  }, {
    tableName: 'supports',
    timestamps: true
  });

  return Support;
};
