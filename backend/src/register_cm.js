const express = require('express');
const router = express.Router();

const pool = require('../db');
const cors = require('cors');


router.use(cors());
router.use(express.json());



router.post('/create',async(req,res)=>{
    const {customer_name,customer_tel} = req.body;
    try{
        const checkTel = await pool.query('SELECT * FROM customer WHERE customer_tel = $1', [customer_tel]);
        if (checkTel.rows.length > 0) {
            // หากหมายเลขโทรศัพท์มีอยู่แล้ว ส่งข้อความแจ้งเตือน
            return res.status(400).json({ error: 'เบอร์โทรนี้ถูกใช้งานแล้ว' });
        }

        const response = await pool.query('INSERT INTO customer (customer_name,customer_tel) VALUES ($1, $2) RETURNING *', [customer_name,customer_tel]);
        res.json(response.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});
module.exports = router;