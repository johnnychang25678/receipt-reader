'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsToMany(models.Receipt, {
        through: models.ReceiptItem,
        foreignKey: 'ItemId',
        as: 'Receipts'
      })

    }
  };
  Item.init({
    itemId: DataTypes.STRING,
    itemName: DataTypes.STRING,
    price: DataTypes.FLOAT(18, 2)
  }, {
    sequelize,
    modelName: 'Item',
  });
  return Item;
};