'use strict';

const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/db.config");

// mysql schema generator to create table
const Inventory = Sequelize.define( "Inventory",
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
      unique: true,
    },
    quantity_on_hand: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reorder_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    location: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
  },
  {
    tableName: "inventory",
    timestamps: false,
    updatedAt: "updated_at",
  }
);

module.exports = Inventory;