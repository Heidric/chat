const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('chatLog', {
    nickname:  {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    channel:   {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    message:   {
      type:      Sequelize.DataTypes.STRING,
      allowNull: false
    },
    raw_message: {
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
