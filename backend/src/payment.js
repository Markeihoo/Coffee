const pool = require('../db');
const express = require('express');
const router = express.Router();


// GET ดึงข้อมูลการชําระเงินทั้งหมด
router.get('/get', async (req, res) => {
    try {
        const response = await pool.query(`
            SELECT 
                p.Payment_id, 
                p.Payment_date, 
                p.Payment_Method,
                c.Customer_name,
                c.Customer_tel, 
                SUM(od.Quantity * pr.Product_price) AS Total_Amount
            FROM Payment p
            JOIN Orders o ON p.Order_id = o.Order_id
            JOIN OrderDetail od ON o.Order_id = od.Order_id
            JOIN Product pr ON od.Product_id = pr.Product_id
            JOIN Customer c ON o.Customer_id = c.Customer_id
            GROUP BY 
                p.Payment_id, 
                p.Payment_date, 
                p.Payment_Method, 
                c.Customer_name,
                c.Customer_tel
            ORDER BY p.Payment_id
        `);

        res.json(response.rows); 
    } catch (err) {
        console.error("Error fetching payment data:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล" });
    }
});

// POST สร้างข้อมูลการชําระเงิน
router.post('/create', async (req, res) => {
    const { payment_method, order_id } = req.body; 

    try {
        const response = await pool.query(
            `
            INSERT INTO Payment (Payment_date, Payment_Method, Order_id)
            VALUES (NOW(), $1, $2)
            RETURNING *;
            `,
            [payment_method, order_id] 
        );

        res.json(response.rows[0]); 
    } catch (err) {
        console.error("Error creating payment:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการสร้าง Payment" });
    }
});

module.exports = router;
