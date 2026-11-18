require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
let pool;
async function init(){
 pool=mysql.createPool({host:process.env.MYSQL_HOST||'localhost',port:Number(process.env.MYSQL_PORT||3306),user:process.env.MYSQL_USER||'root',password:process.env.MYSQL_PASSWORD||'',database:process.env.MYSQL_DATABASE||'apna_parcel',waitForConnections:true,connectionLimit:10});
 await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(120) NOT NULL,email VARCHAR(190) NOT NULL UNIQUE,phone VARCHAR(30),password_hash VARCHAR(255) NOT NULL,role ENUM('user','hub','admin') NOT NULL DEFAULT 'user',approval ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved',hub_address TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
 await pool.query(`CREATE TABLE IF NOT EXISTS bookings (id INT AUTO_INCREMENT PRIMARY KEY,tracking_id VARCHAR(32) NOT NULL UNIQUE,booked_by INT NOT NULL,booking_role ENUM('user','hub') NOT NULL,sender_name VARCHAR(120) NOT NULL,sender_phone VARCHAR(30) NOT NULL,sender_address TEXT NOT NULL,receiver_name VARCHAR(120) NOT NULL,receiver_phone VARCHAR(30) NOT NULL,receiver_address TEXT NOT NULL,parcel_type VARCHAR(80) NOT NULL,weight DECIMAL(8,2) NOT NULL,status VARCHAR(50) NOT NULL DEFAULT 'Pending Admin Approval',assigned_hub INT NULL,locker_number VARCHAR(30) NULL,pickup_pin_hash VARCHAR(255) NULL,pin_issued_at TIMESTAMP NULL,collected_at TIMESTAMP NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(booked_by) REFERENCES users(id),FOREIGN KEY(assigned_hub) REFERENCES users(id))`);
 await pool.query(`CREATE TABLE IF NOT EXISTS tracking_events (id INT AUTO_INCREMENT PRIMARY KEY,booking_id INT NOT NULL,status VARCHAR(100) NOT NULL,note TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE)`);
 const email=process.env.ADMIN_EMAIL||'admin@apnaparcel.local'; const [rows]=await pool.query('SELECT id FROM users WHERE email=?',[email]);
 if(!rows.length){const hash=await bcrypt.hash(process.env.ADMIN_PASSWORD||'Admin@12345',10);await pool.query('INSERT INTO users(name,email,password_hash,role,approval) VALUES(?,?,?,?,?)',['Apna Parcel Admin',email,hash,'admin','approved']);}
}
module.exports={init,get pool(){return pool;}};
