'use strict';

const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/db.config");

// mysql schema generator to create table
const Supplier = Sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
},{
    tableName: 'suppliers',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: 'updated_at'
});

module.exports = Supplier;