const express = require('express')
const router = express.Router()
const pool = require('./../../utils/db')

// http://localhost:5000/api/v1/payments/methods
router.get("/methods", async (req, res) => {
  try {
    const query = `
      SELECT id, name, description, image
      FROM payment_method;
    `
    const [rows] = await pool.query(query)
    return res.json(rows)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

module.exports = router