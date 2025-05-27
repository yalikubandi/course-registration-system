const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP MySQL user
    password: '', // Default XAMPP MySQL password (empty)
    database: 'platform_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});

module.exports = connection;