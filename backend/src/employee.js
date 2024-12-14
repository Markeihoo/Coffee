const pool = require('../db');
const express = require('express');
const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM employee')
        res.json(response.rows)
    } catch (err) {
        console.error(err.message)
    }
});

module.exports = router;