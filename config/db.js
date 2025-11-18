const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || "hdmagency",
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err);
        return;
    }
    console.log("MySQL Connected!");
});

module.exports = db;
