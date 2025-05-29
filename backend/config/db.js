require('dotenv').config();
const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Default XAMPP MySQL user
//     password: '', // Default XAMPP MySQL password (empty)
//     database: 'platform_db'
// });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production'? { rejectUnauthorized: false } : false
});

connection.connect(err => {
  if (err) {
    return console.error('Database connection failed:', err.stack);
  }
  console.log('Connected to MySQL as ID', connection.threadId);
});


module.exports = connection;