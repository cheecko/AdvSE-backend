const express = require('express')
const router = express.Router()
const pool = require('./../../utils/db')
const { BASE_SIZE } = require('./../../utils/constants')
const { getBasePrice, round2Decimal } = require('./../../utils/functions')

const createOrderItem = async (orderId, items) => {
  const query = `
    INSERT INTO order_item (order_id, order_item_id, size, quantity, price, original_price, discount_amount, discount_percentage)
    VALUES ?
  `
  const queryState = items.map(item => [ orderId, item.id, item.variant.size, item.quantity, item.variant.price, item.variant.original_price, item.variant.discount_amount, item.variant.discount_percentage ])
  const [rows] = await pool.query(query, [queryState])
}

const createOrderShippingAddress = async (orderId, address) => {
  const query = `
    INSERT INTO order_shipping_address SET ?
  `
  const queryState = {
    order_id: orderId,
    salutation: address?.salutation ?? '',
    name: `${address?.firstName} ${address?.lastName}` ?? '',
    address: `${address?.street} ${address?.houseNumber}` ?? '',
    additional_address: address?.additionalAddress ?? '',
    postcode: address?.postcode ?? '',
    city: address?.city ?? '',
    phone_number: address?.phoneNumber ?? '',
  }
  const [rows] = await pool.query(query, queryState)
}

const createOrderInvoiceAddress = async (orderId, address) => {
  const query = `
    INSERT INTO order_invoice_address SET ?
  `
  const queryState = {
    order_id: orderId,
    salutation: address?.salutation ?? '',
    name: `${address?.firstName} ${address?.lastName}` ?? '',
    address: `${address?.street} ${address?.houseNumber}` ?? '',
    additional_address: address?.additionalAddress ?? '',
    postcode: address?.postcode ?? '',
    city: address?.city ?? '',
    phone_number: address?.phoneNumber ?? '',
  }
  const [rows] = await pool.query(query, queryState)
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Orders:
 *       required:
 *         - id
 *         - email
 *         - total
 *         - subtotal
 *         - shipping_cost
 *         - payment_method_id
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: test@test.com
 *         total:
 *           type: number
 *           example: 194.75
 *         subtotal:
 *           type: number
 *           example: 194.75
 *         shipping_cost:
 *           type: number
 *           example: 0
 *         payment_method_id:
 *           type: integer
 *           example: 1
 *         payment_method_name:
 *           type: string
 *           example: Rechnung
 *         status:
 *           type: integer
 *           example: 0
 *         created:
 *           type: string
 *           example: 2021-12-13 10:48:45
 *         timestamp:
 *           type: string
 *           example: 2021-12-13 10:48:45
 *         order_items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItems'
 *         invoice_address:
 *           $ref: '#/components/schemas/OrderAddress'
 *         shipping_address:
 *           $ref: '#/components/schemas/OrderAddress'
 *     OrderItems:
 *       required:
 *         - order_id
 *         - order_item_id
 *         - size
 *         - quantity
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         order_item_id:
 *           type: integer
 *           example: 1
 *         size:
 *           type: integer
 *           example: 30
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 38.95
 *         original_price:
 *           type: number
 *           example: 62.50
 *         discount_amount:
 *           type: number
 *           example: 23.55
 *         discount_percentage:
 *           type: integer
 *           example: 38
 *         base_size:
 *           type: integer
 *           example: 100
 *         base_price:
 *           type: number
 *           example: 129.83
 *         created:
 *           type: string
 *           example: 2021-12-13 11:02:37
 *         timestamp:
 *           type: string
 *           example: 2021-12-13 11:02:37
 *     OrderAddress:
 *       required:
 *         - order_id
 *         - salutation
 *         - name
 *         - address
 *         - postcode
 *         - city
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         salutation:
 *           type: string
 *           example: mr
 *         name:
 *           type: string
 *           example: Technical University Brandenburg
 *         address:
 *           type: string
 *           example: Magdeburger Str. 50
 *         additional_address:
 *           type: string
 *           example: Zentrum für Gründung und Transfer Technische Hochschule Brandenburg
 *         postcode:
 *           type: integer
 *           example: 14770
 *         city:
 *           type: string
 *           example: Brandenburg an der Havel
 *         phone_number:
 *           type: string
 *           example: +4933813550
 *         created:
 *           type: string
 *           example: 2021-12-22 13:07:38
 *         timestamp:
 *           type: string
 *           example: 2021-12-22 13:07:38
 */

/**
 * @swagger
 * /api/v1/orders/:
 *   get:
 *     summary: Lists all the orders
 *     description: Lists all the orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email that need to be provided for filter.
 *     responses:
 *       200:
 *         description: The list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: test@test.com
 *                   total:
 *                     type: number
 *                     example: 194.75
 *                   subtotal:
 *                     type: number
 *                     example: 194.75
 *                   shipping_cost:
 *                     type: number
 *                     example: 0
 *                   payment_method_id:
 *                     type: integer
 *                     example: 1
 *                   payment_method_name:
 *                     type: string
 *                     example: Rechnung
 *                   status:
 *                     type: integer
 *                     example: 0
 *                   created:
 *                     type: string
 *                     example: 2021-12-13 10:48:45
 *                   timestamp:
 *                     type: string
 *                     example: 2021-12-13 10:48:45
 */

// http://localhost:5000/api/v1/orders/
router.get("/", async (req, res) => {
  try {
    let whereQuery = []
    let queryState = []

    if(req.query.email) {
      whereQuery = [...whereQuery, 'o.email = ?']
      queryState = [...queryState, req.query.email]
    }

    const query = `
      SELECT o.id, o.email, o.total, o.subtotal, o.shipping_cost, o.payment_method_id, pm.name payment_method_name, o.status, o.created, o.timestamp
      FROM \`order\` o
      JOIN payment_method pm ON pm.id = o.payment_method_id
      WHERE ${whereQuery.length ? whereQuery.join(' AND ') : '1'};
    `
    const [rows] = await pool.query(query, queryState)
    return res.json(rows)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: Gets an order by id
 *     description: Gets an order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order Details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orders'
 */

// http://localhost:5000/api/v1/orders/6
router.get("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId
    const query = `
      SELECT o.id, o.email, o.total, o.subtotal, o.shipping_cost, o.payment_method_id, pm.name payment_method_name, o.status, o.created order_created, o.timestamp order_timestamp, oi.order_item_id, oi.size, oi.quantity, oi.price, oi.original_price, oi.discount_amount, oi.discount_percentage, oi.created order_item_created, oi.timestamp order_item_timestamp, oia.salutation invoice_salutation, oia.name invoice_name, oia.address invoice_address, oia.additional_address invoice_additional_address, oia.postcode invoice_postcode, oia.city invoice_city, oia.phone_number invoice_phone_number, oia.created invoice_created, oia.timestamp invoice_timestamp, osa.salutation shipping_salutation, osa.name shipping_name, osa.address shipping_address, osa.additional_address shipping_additional_address, osa.postcode shipping_postcode, osa.city shipping_city, osa.phone_number shipping_phone_number, osa.created shipping_created, osa.timestamp shipping_timestamp
      FROM \`order\` o
      LEFT JOIN order_item oi ON oi.order_id = o.id
      LEFT JOIN order_invoice_address oia ON oia.order_id = o.id
      LEFT JOIN order_shipping_address osa ON osa.order_id = o.id
      LEFT JOIN payment_method pm ON pm.id = o.payment_method_id
      WHERE o.id = ?;
    `
    const [rows] = await pool.query(query, [orderId])
    const result = rows.reduce((a, b) => {
      return {
        id: b.id,
        email: b.email,
        total: b.total,
        subtotal: b.subtotal,
        shipping_cost: b.shipping_cost,
        payment_method_id: b.payment_method_id,
        payment_method_name: b.payment_method_name,
        status: b.status,
        created: b.order_created,
        timestamp: b.order_timestamp,
        order_items: [...a.order_items, {
          order_item_id: b.order_item_id,
          size: b.size,
          quantity: b.quantity,
          price: round2Decimal(b.price),
          original_price: round2Decimal(b.original_price),
          discount_amount: round2Decimal(b.discount_amount),
          discount_percentage: round2Decimal(b.discount_percentage),
          base_size: BASE_SIZE,
          base_price: round2Decimal(getBasePrice(b.price, b.size, BASE_SIZE)),
        }],
        invoice_address: {
          salutation: b.invoice_salutation,
          name: b.invoice_name,
          address: b.invoice_address,
          additional_address: b.invoice_additional_address,
          postcode: b.invoice_postcode,
          city: b.invoice_city,
          phone_number: b.invoice_phone_number,
          created: b.invoice_created,
          timestamp: b.invoice_timestamp
        },
        shipping_address: {
          salutation: b.shipping_salutation,
          name: b.shipping_name,
          address: b.shipping_address,
          additional_address: b.shipping_additional_address,
          postcode: b.shipping_postcode,
          city: b.shipping_city,
          phone_number: b.shipping_phone_number,
          created: b.shipping_created,
          timestamp: b.shipping_timestamp
        }
      }
    }, {order_items: []})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/:
 *   post:
 *     summary: Creates a new order
 *     description: Creates a new order
 *     tags: [Orders]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orders'
 *       required: true
 *     responses:
 *       200:
 *         description: Order is created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/", async (req, res) => {
  try {
    const query = `
      INSERT INTO \`order\` (email, total, subtotal, shipping_cost, payment_method_id, status)
      VALUES ?
    `
    const queryState = [[
      req.body?.email ?? '',
      req.body?.order?.total ?? '0.00',
      req.body?.order?.subtotal ?? '0.00',
      req.body?.order?.shippingCost ?? '0.00',
      req.body?.paymentMethod ?? 0,
      0
    ]]
    const [rows] = await pool.query(query, [queryState])
    
    const orderId = rows.insertId
    await createOrderItem(orderId, req.body?.order?.items ?? [])
    await createOrderShippingAddress(orderId, req.body?.shippingAddress ?? {})
    await createOrderInvoiceAddress(orderId, req.body?.invoiceAddress ?? {})

    return res.json({ order_id: orderId })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/{orderId}/items:
 *   get:
 *     summary: Gets an order items by order id and item id
 *     description: Gets an order items by order id and item id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order Details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItems'
 */

// http://localhost:5000/api/v1/orders/6/items
router.get("/:orderId/items", async (req, res) => {
  try {
    const orderId = req.params.orderId
    const query = `
      SELECT order_item_id, size, quantity, price, original_price, discount_amount, discount_percentage, created, timestamp
      FROM order_item
      WHERE order_id = ?;
    `
    const [rows] = await pool.query(query, [orderId])
    const result = rows.map(row => {
      return {
        ...row,
        price: round2Decimal(row.price),
        original_price: round2Decimal(row.original_price),
        discount_amount: round2Decimal(row.discount_amount),
        discount_percentage: round2Decimal(row.discount_percentage),
        base_size: BASE_SIZE,
        base_price: round2Decimal(getBasePrice(row.price, row.size, BASE_SIZE))
      }
    })
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/{orderId}/items/{itemId}:
 *   get:
 *     summary: Gets list order items by id
 *     description: Gets list order items by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order id
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order Item id
 *     responses:
 *       200:
 *         description: Order Details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItems'
 */

// http://localhost:5000/api/v1/orders/6/items/2
router.get("/:orderId/items/:itemId", async (req, res) => {
  try {
    const orderId = req.params.orderId
    const orderItemId = req.params.itemId
    const query = `
      SELECT order_item_id, size, quantity, price, original_price, discount_amount, discount_percentage, created, timestamp
      FROM order_item
      WHERE order_id = ? AND order_item_id = ?;
    `
    const [rows] = await pool.query(query, [orderId, orderItemId])
    const result = rows.map(row => {
      return {
        ...row,
        price: round2Decimal(row.price),
        original_price: round2Decimal(row.original_price),
        discount_amount: round2Decimal(row.discount_amount),
        discount_percentage: round2Decimal(row.discount_percentage),
        base_size: BASE_SIZE,
        base_price: round2Decimal(getBasePrice(row.price, row.size, BASE_SIZE)),
      }
    }).reduce((a,b) => b, {})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/{orderId}/invoice_address:
 *   get:
 *     summary: Gets an order invoice address by id
 *     description: Gets an order invoice address by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order Details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderAddress'
 */

// http://localhost:5000/api/v1/orders/6/invoice_address
router.get("/:orderId/invoice_address", async (req, res) => {
  try {
    const orderId = req.params.orderId
    const query = `
      SELECT salutation, name, address, additional_address, postcode, city, phone_number, created, timestamp
      FROM order_invoice_address
      WHERE order_id = ?;
    `
    const [rows] = await pool.query(query, [orderId])
    const result = rows.reduce((a,b) => b, {})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/orders/{orderId}/shipping_address:
 *   get:
 *     summary: Gets an order shipping address by id
 *     description: Gets an order shipping address by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order Details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderAddress'
 */

// http://localhost:5000/api/v1/orders/6/shipping_address
router.get("/:orderId/shipping_address", async (req, res) => {
  try {
    const orderId = req.params.orderId
    const query = `
      SELECT salutation, name, address, additional_address, postcode, city, phone_number, created, timestamp
      FROM order_shipping_address
      WHERE order_id = ?;
    `
    const [rows] = await pool.query(query, [orderId])
    const result = rows.reduce((a,b) => b, {})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

module.exports = router