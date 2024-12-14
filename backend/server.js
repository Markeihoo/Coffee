const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const Login = require('./login');

const Category = require('./src/category');
const Product = require('./src/product');
const Customer = require('./src/customer');
const Employee = require('./src/employee');
const Orders = require('./src/orders');
const OrderDetails = require('./src/orderDetails');
const Payment = require('./src/payment');



dotenv.config();

const app = express();
const port = 8000;

// PostgreSQL Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(express.json());


const cors = require('cors');
app.use(cors()); // เปิดใช้ CORS สำหรับทุกโดเมน

// Example route

app.use('/login', Login);
app.use('/category', Category); //localhost:8000/category/get
app.use('/product', Product);   //localhost:8000/product/get/3
app.use('/customer', Customer); //localhost:8000/customer/get
app.use('/employee', Employee); //localhost:8000/employee/get
app.use('/orders', Orders);     //localhost:8000/orders/get
app.use('/orderDetails', OrderDetails); //localhost:8000/orderDetails/get/1
app.use('/payment', Payment);   //localhost:8000/payment/get

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
