const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('filteredWord', {
    word:  {
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
