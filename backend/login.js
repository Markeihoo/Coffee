const express = require('express');
const router = express.Router();
const port = 8000;
const pool = require('./db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const e = require('express');

const secret = "Test@4%#$6*"; 

router.use(cors());
router.use(express.json());

router.post('/login',async (req, res) => {
    const { employee_id, password } = req.body;
    if(!employee_id || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try{
        const result = await pool.query('SELECT * FROM employee WHERE employee_id = $1 AND password = $2', [employee_id, password]);
        if(result.rows.length ===  0){
            return res.status(401).json({ message: 'ไม่พบพนักงาน' });
        }
        const  token = jwt.sign({ employee_id: result.rows[0].employee_id }, secret, { expiresIn: '1h' });
        res.status(200).json({message:"เข้าสู่ระบบสําเร็จ", token:token});
       
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
        
    }
    
});

router.get('/employee/:token', async (req, res) => {
    const token = req.params.token;
    try {
        const decoded = jwt.verify(token, secret);
        const employee_id = decoded.employee_id;
        const result = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
        res.json(result.rows);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;