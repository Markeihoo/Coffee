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

router.get('/', (req, res) => {
    res.send('Hello World');
})

router.post('/create',async(req, res) => {
    const {employee_fname, employee_lname, password, tel} = req.body;
    try{
        const response = await pool.query('INSERT INTO employee (employee_fname, employee_lname, password, tel) VALUES ($1, $2, $3, $4) RETURNING *', [employee_fname, employee_lname, password, tel]);
        res.json(response.rows[0]);
    }catch(err){
        console.log(err.message);
    }
})



router.post('/login',async (req, res) => {
    const { tel, password } = req.body;
    if(!tel || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try{
        const result = await pool.query('SELECT * FROM employee WHERE tel = $1 AND password = $2', [tel, password]);
        if(result.rows.length ===  0){
            return res.status(401).json({ message: 'ไม่พบพนักงาน' });
        }
        const  token = jwt.sign({ tel: result.rows[0].tel }, secret, { expiresIn: '1h' });
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
        const tel = decoded.tel;
        const result = await pool.query('SELECT * FROM employee WHERE tel = $1', [tel]);
        res.json(result.rows);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;