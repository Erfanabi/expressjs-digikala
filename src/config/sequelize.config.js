const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.NODE_ENV === "development" ? console.log : false, // لاگ SQL در محیط توسعه
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected to MySQL successfully");
  })
  .catch(err => {
    console.log("Cannot connect to database");
  });

module.exports = sequelize;
