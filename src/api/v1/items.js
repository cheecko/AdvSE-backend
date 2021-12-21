const express = require('express')
const router = express.Router()
// db connection
const pool = require('./../../utils/db')
const baseSize = 100

const getBasePrice = (price, size) => {
  return price / size * baseSize
}

const round2Decimal = (value) => {
  return parseFloat(parseFloat(value).toFixed(2))
}

const getSortQuery = (sort) => {
  switch (sort) {
    case 'name asc':
      return 'i.name ASC'
    case 'name desc':
      return 'i.name DESC'
    case 'price asc':
      return 'iv.price ASC'
    case 'price desc':
      return 'iv.price DESC'
    default:
      return 'i.id'
  }
}

// http://localhost:5000/api/v1/items/brands
router.get("/brands", async (req, res) => {
  try {
    const query = `
      SELECT brand_id, brand_name
      FROM item_brand;
    `
    const [rows] = await pool.query(query)
    return res.json(rows)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

// http://localhost:5000/api/v1/items/brands/1
router.put("/brands/:id", async (req, res) => {
  // update item brand from a certain id
  // see api in users.js for example to get id from req
})

// http://localhost:5000/api/v1/items/brands
router.post("/brands", async (req, res) => {
  // create new item brand
})

// http://localhost:5000/api/v1/items/brands/1
router.delete("/brands/:id", async (req, res) => {
  // delete item brand from a certain id
  // see api in users.js for example to get id from req
})

// http://localhost:5000/api/v1/items/
router.get("/", async (req, res) => {
  try {
    const whereQuery = req.query.id ? ` AND i.id IN (${req.query.id})` : ''
    const sortQuery = req.query.sort ? getSortQuery(req.query.sort) : 'i.id'
    const query = `
      SELECT i.id, i.brand_id, ib.brand_name, i.type_id, it.type_name, i.name, i.image, 4.3 rating, i.created, i.timestamp, iv.size, iv.price, iv.discount_percentage
      FROM item i
      JOIN item_type it ON it.type_id = i.type_id
      JOIN item_brand ib ON ib.brand_id = i.brand_id
      JOIN item_category ic ON ic.category_id = i.category_id
      JOIN (
        SELECT *
        FROM item_variant
        GROUP BY item_id
      ) iv ON iv.item_id = i.id
      WHERE 1=1 ${whereQuery}
      ORDER BY ${sortQuery};
    `
    const [rows] = await pool.query(query)
    const result = rows.map(row => {
      return {
        ...row,
        base_size: baseSize,
        base_price: round2Decimal(getBasePrice(row.price, row.size))
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
      SELECT i.id, i.brand_id, ib.brand_name, i.type_id, it.type_name, i.category_id, i.name, i.image, i.description, i.instruction, i.created, i.timestamp, iv.size, iv.stock, iv.price, iv.original_price, iv.discount_amount, iv.discount_percentage
      FROM item i
      JOIN item_type it ON it.type_id = i.type_id
      JOIN item_brand ib ON ib.brand_id = i.brand_id
      JOIN item_category ic ON ic.category_id = i.category_id
      JOIN item_variant iv ON iv.item_id = i.id
      WHERE i.id = ?;
    `
    const [rows] = await pool.execute(query, [itemId])
    const result = rows.reduce((a, b) => {
      return {
        ...b,
        variants: [...a.variants, {
          variant_id: b.variant_id,
          size: b.size,
          stock: b.stock,
          price: round2Decimal(b.price),
          original_price: round2Decimal(b.original_price),
          discount_amount: round2Decimal(b.discount_amount),
          discount_percentage: round2Decimal(b.discount_percentage),
          base_size: baseSize,
          base_price: round2Decimal(getBasePrice(b.price, b.size))
        }],
        variant_id: undefined,
        size: undefined,
        stock: undefined,
        price: undefined,
        original_price: undefined,
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