const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('user', {
    nickname:  {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    password:  {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type:         Sequelize.DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      type:         Sequelize.DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  })
};
