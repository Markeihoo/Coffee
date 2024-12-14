const pool = require('../db')
const express = require('express');
const router = express.Router();


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

router.post('/create', async (req, res) => {
    const { order_date, order_status, employee_id, customer_id, orderDetails } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!order_date || !order_status || !employee_id || !customer_id || !orderDetails || orderDetails.length === 0) {
        return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
    }

    const client = await pool.connect();
    try {
        // เริ่มต้น transaction
        await client.query('BEGIN');

        // 1. สร้างออเดอร์ใหม่ (ไม่ต้องระบุ Order_id เพราะจะถูกสร้างอัตโนมัติ)
        const orderResult = await client.query(
            'INSERT INTO orders (order_date, order_status, employee_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING Order_id',
            [order_date, order_status, employee_id, customer_id]
        );

        const order_id = orderResult.rows[0].order_id; // ได้รับ order_id ของออเดอร์ที่เพิ่งสร้าง

        // 2. ตรวจสอบข้อมูลใน OrderDetail ก่อนการแทรก
        const orderDetailPromises = orderDetails.map(async (detail) => {
            // ตรวจสอบว่าใน OrderDetail มีข้อมูลที่มี Order_id และ Product_id ซ้ำหรือไม่
            const existingDetail = await client.query(
                'SELECT * FROM orderdetail WHERE order_id = $1 AND product_id = $2',
                [order_id, detail.product_id]
            );

            if (existingDetail.rows.length > 0) {
                // ถ้ามีข้อมูลที่ซ้ำกัน ให้ข้ามการแทรก
                console.log(`รายการสินค้ารหัส ${detail.product_id} ในออเดอร์ ${order_id} ถูกแทรกแล้ว`);
                return;
            }

            // ถ้าไม่มีข้อมูลที่ซ้ำกัน ให้ทำการแทรกข้อมูลใหม่
            await client.query(
                'INSERT INTO orderdetail (quantity, orderde_discription, order_id, product_id) VALUES ($1, $2, $3, $4)',
                [detail.quantity, detail.orderde_discription, order_id, detail.product_id]
            );
        });

        // รอให้ทุกคำสั่ง insert ใน OrderDetail เสร็จ
        await Promise.all(orderDetailPromises);

        // ยืนยันการทำ transaction
        await client.query('COMMIT');

        // ส่งผลลัพธ์กลับไป
        res.status(201).json({ message: 'ออเดอร์และรายละเอียดถูกสร้างเรียบร้อยแล้ว', order_id });

    } catch (err) {
        // หากเกิดข้อผิดพลาด ทำการ rollback
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสร้างออเดอร์' });
    } finally {
        client.release();
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

// Route สำหรับการดึงออเดอร์ล่าสุดพร้อมราคารวม
router.get('/get/latest', async (req, res) => {
    try {
        // SQL query ดึงข้อมูลออเดอร์ล่าสุดพร้อมคำนวณราคารวม (total_price)
        const query = `
            SELECT 
                o.order_id, 
                o.order_date, 
                o.order_status, 
                o.employee_id, 
                o.customer_id,
                c.customer_name,
                COALESCE(SUM(od.quantity * p.product_price), 0) AS total_price
            FROM 
                orders o
            LEFT JOIN 
                customer c ON o.customer_id = c.customer_id
            LEFT JOIN 
                orderdetail od ON o.order_id = od.order_id
            LEFT JOIN 
                product p ON od.product_id = p.product_id
            GROUP BY 
                o.order_id,customer_name
            ORDER BY 
                o.order_date DESC
            LIMIT 1
        `;

        const response = await pool.query(query);

        // ส่งข้อมูลออเดอร์ล่าสุด
        if (response.rows.length > 0) {
            res.json(response.rows[0]); // ส่งออเดอร์พร้อมราคารวม
        } else {
            res.status(404).json({ message: 'ไม่พบออเดอร์' });
        }
    } catch (err) {
        console.error('Error fetching latest order:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;