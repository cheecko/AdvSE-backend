const express = require('express')
const router = express.Router()
const pool = require('./../../utils/db')
const baseSize = 100

const getBasePrice = (price, size) => {
  return (price / size * baseSize).toFixed(2)
}

// http://localhost:5000/api/v1/items/
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT i.id, i.brand_id, ib.name brand_name, i.type_id, it.name type_name, i.name, i.image, i.description, i.created, i.timestamp, iv.size, iv.price, iv.discount_percentage
      FROM item i
      JOIN item_type it ON it.id = i.type_id
      JOIN item_brand ib ON ib.id = i.brand_id
      JOIN item_category ic ON ic.id = i.category_id
      JOIN (
        SELECT *
        FROM item_variant
        GROUP BY item_id
      ) iv ON iv.item_id = i.id;
    `
    const [rows] = await pool.query(query);
    const result = rows.map(row => {
      return {
        ...row,
        base_size: baseSize,
        base_price: getBasePrice(row.price, row.size)
      }
    })
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

// http://localhost:5000/api/v1/items/1
router.get("/:id", async (req, res) => {
  try {
    const itemId = req.params.id
    const query = `
      SELECT i.id, i.brand_id, ib.name, i.type_id, it.name, i.category_id, i.name, i.image, i.description, i.created, i.timestamp, iv.variant_id, iv.size, iv.stock, iv.price, iv.base_price, iv.discount_amount, iv.discount_percentage
      FROM item i
      JOIN item_type it ON it.id = i.type_id
      JOIN item_brand ib ON ib.id = i.brand_id
      JOIN item_category ic ON ic.id = i.category_id
      JOIN item_variant iv ON iv.item_id = i.id
      WHERE i.id = ?;
    `
    const [rows] = await pool.execute(query, [itemId]);
    const result = rows.reduce((a, b) => {
      return {
        ...b,
        variants: [...a.variants, {
          variant_id: b.variant_id,
          size: b.size,
          stock: b.stock,
          price: b.price,
          base_price: b.base_price,
          discount_amount: b.discount_amount,
          discount_percentage: b.discount_percentage
        }],
        variant_id: undefined,
        size: undefined,
        stock: undefined,
        price: undefined,
        base_price: undefined,
        discount_amount: undefined,
        discount_percentage: undefined
      }
    }, {variants: []})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

module.exports = router