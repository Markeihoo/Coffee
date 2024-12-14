const pool = require('../db')
const express = require('express');
const router = express.Router();

router.get('/get', async (req, res) => {
    try {
const response = await pool.query("SELECT * FROM orders WHERE order_status = 'กำลังดำเนินการ'");
        res.json(response.rows)
    } catch (err) {
        console.error(err.message)
    }
});
router.patch('/update/:order_id', async (req, res) => {
    const { order_id } = req.params;
    const { order_status } = req.body;
    
    // ตรวจสอบว่าได้รับค่า order_status หรือไม่
    if (!order_status) {
        return res.status(400).json({ error: "สถานะออเดอร์ไม่สามารถเป็น null หรือ ค่าว่างได้" });
    }

    try {
        // ใช้คำสั่ง UPDATE พร้อม RETURNING เพื่อให้ฐานข้อมูลส่งข้อมูลที่ถูกอัปเดตกลับมา
        const response = await pool.query(
            'UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *',
            [order_status, order_id]
        );

        // เช็คผลลัพธ์ของการอัปเดต
        if (response.rows.length === 0) {
            return res.status(404).json({ error: "ไม่พบออเดอร์ที่ต้องการอัปเดต" });
        }

        // ส่งข้อมูลที่ถูกอัปเดตกลับไป
        res.json(response.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;