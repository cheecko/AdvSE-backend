const express = require('express')
const router = express.Router()
const pool = require('./../../utils/db')

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethods:
 *       required:
 *         - id
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Rechnung
 *         description:
 *           type: string
 *           example: Erst kaufen, dann bezahlen
 *         image:
 *           type: string
 *           example: https://resources.live.oscato.com/resource/network/FLACONI/de_DE/KLARNA_PAY_LATER/logo.png
 */

/**
 * @swagger
 * /api/v1/payments/methods:
 *   get:
 *     summary: Lists all the payment methods
 *     description: Lists all the payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: The list of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethods'
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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