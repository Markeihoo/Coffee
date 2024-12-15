const pool = require('../db')
const express = require('express');
const router = express.Router();

// GET ดึงข้อมูลสินค้าทั้งหมด
router.get('/get/:category_id', async (req, res) => {
    const { category_id } = req.params ;

    if (!category_id) {
        return res.status(400).json({ error: "category_id is required" });
    }

    try {
        const response = await pool.query('SELECT * FROM product WHERE category_id = $1', [category_id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        res.json(response.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;