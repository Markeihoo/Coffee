const pool = require('../db')
const express = require('express');
const router = express.Router();

router.get('/get/:order_id', async (req, res) => {
    const { order_id } = req.params ;

    // ตรวจสอบว่า order_id ถูกส่งมาใน query หรือไม่
    if (!order_id) {
        return res.status(400).json({ error: "order_id is required" });
    }

    try {
        // ดึงข้อมูลจากฐานข้อมูล
        const response = await pool.query('SELECT * FROM orderdetail WHERE order_id = $1', [order_id]);
        
        // ส่งข้อมูลกลับเป็น JSON
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "No order details found for this order" });
        }

        res.json(response.rows);
    } catch (err) {
        // แสดงข้อผิดพลาดในกรณีที่เกิดข้อผิดพลาดในการทำงาน
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;