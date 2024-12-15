const pool = require('../db');
const express = require('express');
const router = express.Router();

// GET ดึงข้อมูลลูกค้าทั้งหมด
router.get('/get', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM customer ORDER BY customer_id ASC');
        res.json(response.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" }); 
    }
});

// POST สร้างข้อมูลลูกค้า
router.post('/create', async (req, res) => {
    const { Customer_name, Customer_tel } = req.body;  

    if (!Customer_name || !Customer_tel) {
        return res.status(400).json({ error: "Customer_name and Customer_tel are required" });
    }

    try {
        const checkTelExists = await pool.query(
            'SELECT * FROM Customer WHERE Customer_tel = $1',
            [Customer_tel]
        );

        // ถ้าเบอร์โทรซ้ำ
        if (checkTelExists.rows.length > 0) {
            return res.status(400).json({ error: "This phone number is already in use" });
        }

        // ถ้าเบอร์ไม่ซ้ำ จะทำการเพิ่มข้อมูลใหม่
        const response = await pool.query(
            'INSERT INTO Customer (Customer_name, Customer_tel) VALUES ($1, $2) RETURNING *',
            [Customer_name, Customer_tel]
        );

        return res.json(response.rows[0]);  

    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// PATCH อัพเดตข้อมูลลูกค้า
router.patch('/update/:customer_id', async (req, res) => {
    const { customer_id } = req.params;  
    const { Customer_name, Customer_tel } = req.body;  

    // ตรวจสอบว่า customer_id, Customer_name และ Customer_tel ถูกส่งมาหรือไม่
    if (!customer_id || !Customer_name || !Customer_tel) {
        return res.status(400).json({ error: "customer_id, Customer_name and Customer_tel are required" });
    }

    try {
        // ตรวจสอบว่าเบอร์โทรศัพท์ที่กำลังจะอัพเดตนั้นซ้ำกับเบอร์โทรในฐานข้อมูลหรือไม่
        const checkTelExists = await pool.query(
            'SELECT * FROM Customer WHERE Customer_tel = $1 AND customer_id != $2',  // เช็คเบอร์โทรที่ไม่ใช่ลูกค้ารายนี้
            [Customer_tel, customer_id]
        );

        // ถ้าเบอร์โทรซ้ำ
        if (checkTelExists.rows.length > 0) {
            return res.status(400).json({ error: "This phone number is already in use by another customer" });
        }

        // ทำการอัพเดตข้อมูลลูกค้า
        const response = await pool.query(
            'UPDATE Customer SET Customer_name = $1, Customer_tel = $2 WHERE customer_id = $3 RETURNING *',
            [Customer_name, Customer_tel, customer_id]
        );

        // ถ้าข้อมูลถูกอัพเดตสำเร็จ ส่งกลับข้อมูลที่ถูกแก้ไข
        if (response.rows.length > 0) {
            return res.json(response.rows[0]);
        } else {
            return res.status(404).json({ error: "Customer not found" });
        }

    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});
// DELETE ลบข้อมูลลูกค้า
router.delete('/delete/:customer_id', async (req, res) => {
    const { customer_id } = req.params;    

    // ตรวจสอบว่า customer_id ถูกส่งมาหรือไม่
    if (!customer_id) {
        return res.status(400).json({ error: "customer_id is required" });
    }

    try {
        // ทำการลบข้อมูลลูกค้า
        const response = await pool.query(
            'DELETE FROM Customer WHERE customer_id = $1 RETURNING *',
            [customer_id]
        );

        // ถ้าข้อมูลถูกลบสำเร็จ ส่งกลับข้อมูลที่ถูกลบ
        if (response.rows.length > 0) {
            return res.json({ message: "Customer deleted successfully", customer: response.rows[0] });
            
        } else {
            return res.status(404).json({ error: "Customer not found" });
        }

    } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

module.exports = router;
