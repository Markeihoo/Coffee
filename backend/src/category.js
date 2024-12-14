const pool = require('../db')
const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM category')
        res.json(response.rows)
    } catch (err) {
        console.error(err.message)
    }
})