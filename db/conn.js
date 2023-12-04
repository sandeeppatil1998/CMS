const mysql = require('mysql2');
require('dotenv').config();


let conn = mysql.createConnection({
    // host: process.env.HOST,
    // user: process.env.USER,
    // password: process.env.PASSWORD,
    // database: process.env.DATABASE
    host: 'localhost',
    user: "root",
    password: "password123",
    database: "cms"
});

conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
}); 

module.exports = conn;