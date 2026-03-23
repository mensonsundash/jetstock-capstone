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

        await sequelize.sync();
        console.log('Database synchronized');
    }catch(error) {
        console.error("Unable to connect to MySQL database:", error.message);
        process.exit(1);
    }

}

//calling function to connect DB
connectDB();

module.exports = {Sequelize: sequelize}