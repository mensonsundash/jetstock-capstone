const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const StockMovement = sequelize.define( "stockMovement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    movement_type: {
      type: DataTypes.ENUM("IN", "OUT"),
      allowNull: false,
    },
    source_type: {
      type: DataTypes.ENUM("MANUAL", "ONLINE", "DAMAGE", "RETURN"),
      allowNull: false,
      defaultValue: "MANUAL",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    movement_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "stock_movements",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = StockMovement;