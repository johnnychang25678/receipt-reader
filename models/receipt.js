'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Receipt.belongsToMany(models.Item, {
        through: models.ReceiptItem,
        foreignKey: 'ReceiptId',
        as: 'Items'
      })
      Receipt.hasMany(models.ReceiptItem)
      Receipt.belongsTo(models.Tag)
      Receipt.belongsTo(models.User)
    }
  };
  Receipt.init({
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    MerchantId: DataTypes.INTEGER,
    receiptID: DataTypes.STRING,
    TagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Receipt'
  })
  return Receipt
}
