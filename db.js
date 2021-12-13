const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  port: "3308",
  user: "root",
  password: "",
  database: "submission_system",
});

module.exports = { pool };
