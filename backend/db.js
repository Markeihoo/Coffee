
const { Pool } = require('pg');


const pool = new Pool({
  user: 'Coffee', // ใช้ค่าที่ตั้งใน Docker Compose
  host: 'localhost', // ถ้าใช้ Docker Desktop บน macOS หรือ Windows ใช้ localhost
  database: 'Coffee', // ใช้ค่าที่ตั้งใน Docker Compose
  password: '123456', // ใช้ค่าที่ตั้งใน Docker Compose
  port: 5432, // พอร์ตที่ใช้เชื่อมต่อ
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));
module.exports = pool; // ส่งออก pool

