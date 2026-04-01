"use strict";
const {Sequelize}  = require('sequelize');//importing sequelize module

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false
    }
);

// function to connect MYSQL database 
const connectDB = async () => {
    try{    
        await sequelize.authenticate();
        console.log(`Successful connection to MySQL Database ${process.env.DB_NAME}`);
    }catch(error) {
        console.error("Unable to connect to MySQL database:", error.message);
        if(process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }

        throw error;
    }

}

module.exports = {Sequelize: sequelize, connectDB}