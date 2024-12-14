const pool = require('../db')
const express = require('express');
const router = express.Router();

// API สำหรับดึงข้อมูลออเดอร์พร้อมรายละเอียดสินค้า

// API สำหรับดึงข้อมูลออเดอร์ที่มีสถานะ 'กำลังดำเนินการ' พร้อมรายละเอียดสินค้า
router.get('/get', async (req, res) => {
    try {
        // SQL Query เพื่อดึงข้อมูลจาก Orders, OrderDetail และ Product สำหรับสถานะ 'กำลังดำเนินการ'
        const query = `
            SELECT 
                orders.order_id, 
                orders.order_date, 
                orders.order_status, 
                orderdetail.Quantity, 
                orderdetail.OrderDe_discription, 
                product.product_name
            FROM 
                orders
            INNER JOIN 
                orderdetail ON orders.order_id = orderdetail.Order_id
            INNER JOIN 
                product ON orderdetail.Product_id = product.Product_id
            WHERE 
                orders.order_status = 'กำลังดำเนินการ'
            ORDER BY 
                orders.order_date;
        `;
        
        // Execute query
        const response = await pool.query(query);

        // หากไม่มีข้อมูล
        if (response.rows.length === 0) {
            return res.status(404).json({ error: "ไม่พบออเดอร์ที่มีสถานะกำลังดำเนินการ" });
        }

        // จัดกลุ่มข้อมูลตาม order_id
        const orders = response.rows.reduce((acc, row) => {
            const orderIndex = acc.findIndex(order => order.order_id === row.order_id);
            
            if (orderIndex === -1) {
                acc.push({
                    order_id: row.order_id,
                    order_date: row.order_date,
                    order_status: row.order_status,
                    products: [{
                        product_name: row.product_name,
                        Quantity: row.quantity,
                        OrderDe_discription: row.orderde_discription
                    }]
                });
            } else {
                acc[orderIndex].products.push({
                    product_name: row.product_name,
                    Quantity: row.quantity,
                    OrderDe_discription: row.orderde_discription
                });
            }
            return acc;
        }, []);
        
        // ส่งข้อมูลทั้งหมดกลับไปยัง client
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
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