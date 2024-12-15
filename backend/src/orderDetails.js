const pool = require('../db')
const express = require('express');
const router = express.Router();

// GET ดึงข้อมูลรายการสั่งซื้อที่มีรหัส order_idนั้น
router.get('/get/:order_id', async (req, res) => {
    const { order_id } = req.params ;

    if (!order_id) {
        return res.status(400).json({ error: "order_id is required" });
    }

    try {
        const response = await pool.query('SELECT * FROM orderdetail WHERE order_id = $1', [order_id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "No order details found for this order" });
        }

        res.json(response.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;