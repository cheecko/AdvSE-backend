const express = require('express')
const router = express.Router()
// db connection
const pool = require('./../../utils/db')
const { BASE_SIZE } = require('./../../utils/constants')
const { getBasePrice, round2Decimal } = require('./../../utils/functions')

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Items:
 *       required:
 *         - id
 *         - brand_id
 *         - type_id
 *         - category_id
 *         - name
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         brand_id:
 *           type: integer
 *           example: 1
 *         brand_name:
 *           type: string
 *           example: Lancôme
 *         type_id:
 *           type: integer
 *           example: 1
 *         type_name:
 *           type: string
 *           example: Eau de Parfum
 *         category_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: La vie est belle
 *         image:
 *           type: string
 *           example: https://cdn.flaconi.de/media/catalog/product/l/a/lancome-la-vie-est-belle-eau-de-parfum-50-ml-3605532612768.jpg
 *         description:
 *           type: string
 *           example: La vie est belle ist ein Duft der Freiheit und des Glücks. Eine Hommage an die Schönheit des Lebens. Das Eau de Parfum verzaubert mit edlen, natürlichen Ingredienzen wie Pallida de Florence-Iris, Sambac-Jasmin-Absolu, Orangenblüten-Absolu und einer Patschuli-Essenz, die von sanften Gourmet-Noten eingehüllt werden. Ein einzigartiger Duftcharakter. Exklusiv von drei der größten französischen Parfümeure für Lancôme kreiert. 
 *         instruction:
 *           type: string
 *           example: Für eine langanhaltende Duftwirkung sprühen Sie das Produkt aus 20 cm Entfernung auf die Haut. Bevorzugen Sie dabei warme Körperbereiche z.B. die Innenseite der Handgelenke, die Stellen hinter den Ohrläppchen oder den Kniebeugen.
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemVariants'
 *         created:
 *           type: string
 *           example: 2021-12-13 10:48:45
 *         timestamp:
 *           type: string
 *           example: 2021-12-13 10:48:45
 *     ItemVariants:
 *       required:
 *         - item_id
 *         - size
 *       type: object
 *       properties:
 *         item_id:
 *           type: integer
 *           example: 1
 *         size:
 *           type: integer
 *           example: 30
 *         stock:
 *           type: integer
 *           example: 13743
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
 *     ItemBrands:
 *       required:
 *         - brand_id
 *         - brand_name
 *       type: object
 *       properties:
 *         brand_id:
 *           type: integer
 *           example: 1
 *         brand_name:
 *           type: string
 *           example: Lancôme
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong.
 */

/**
 * @swagger
 * /api/v1/items/brands/:
 *   get:
 *     summary: Lists all the item brands
 *     description: Lists all the item brands
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: The list of item brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemBrands'
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// http://localhost:5000/api/v1/items/brands/
router.get('/brands', async (req, res) => {
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

/**
 * @swagger
 * /api/v1/items/brands/{itemBrandId}:
 *   get:
 *     summary: Get an item brand by id
 *     description: Get an item brand by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemBrandId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item Brand id
 *     responses:
 *       200:
 *         description: Item Brand Details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemBrands'
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// http://localhost:5000/api/v1/items/brands/1
router.get('/brands/:itemBrandId', async (req, res) => {
  const itemBrandId = req.params.itemBrandId
  try {
    const query = `
      SELECT brand_id, brand_name
      FROM item_brand
      WHERE brand_id = ?;
    `
    const [rows] = await pool.execute(query, [itemBrandId])
    const result = rows.reduce((a,b) => b, {})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/items/brands/{itemBrandId}:
 *   put:
 *     summary: Update an item brand by id
 *     description: Update an item brand by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemBrandId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item Brand id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemBrands'
 *       required: true
 *     responses:
 *       200:
 *         description: Item Brand is updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 changedRows:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// http://localhost:5000/api/v1/items/brands/1
router.put('/brands/:itemBrandId', async (req, res) => {
  try {
    const itemBrandId = req.params.itemBrandId
    const query = `
      UPDATE item_brand SET ?
      WHERE brand_id = ?
    `
    const queryState = { brand_name: req.body?.brand_name ?? '' }
    const [rows] = await pool.query(query, [queryState, itemBrandId])

    return res.json({ changedRows: rows.changedRows })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/items/brands/:
 *   post:
 *     summary: Creates a new item brand
 *     description: Creates a new item brand
 *     tags: [Items]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemBrands'
 *       required: true
 *     responses:
 *       200:
 *         description: Item Brand is created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brand_id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// http://localhost:5000/api/v1/items/brands/
router.post('/brands', async (req, res) => {
  try {
    const query = `
      INSERT INTO item_brand SET ?
    `
    const queryState = { brand_name: req.body?.brand_name ?? '' }
    const [rows] = await pool.query(query, queryState)

    return res.json({ brandId: rows.insertId })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/items/brands/{itemBrandId}:
 *   delete:
 *     summary: Delete an item brand by id
 *     description: Delete an item brand by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemBrandId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item Brand id
 *     responses:
 *       200:
 *         description: Item Brand is deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 affectedRows:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error Message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// http://localhost:5000/api/v1/items/brands/1
router.delete('/brands/:itemBrandId', async (req, res) => {
  try {
    const itemBrandId = req.params.itemBrandId
    const query = `
      DELETE FROM item_brand
      WHERE brand_id = ?
    `
    const [rows] = await pool.query(query, [itemBrandId])

    return res.json({ affectedRows: rows.affectedRows })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

/**
 * @swagger
 * /api/v1/items/:
 *   get:
 *     summary: Lists all the items
 *     description: Lists all the items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Item ids that need to be provided for filter. Mutiple ids can be provided with comma separated strings
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: id asc
 *           enum:
 *             - id asc
 *             - name asc
 *             - name desc
 *             - price asc
 *             - price desc
 *         description: Sort value that need to be provided for sorting.
 *     responses:
 *       200:
 *         description: The list of items
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
 *                   brand_id:
 *                     type: integer
 *                     example: 1
 *                   brand_name:
 *                     type: string
 *                     example: Lancôme
 *                   type_id:
 *                     type: integer
 *                     example: 1
 *                   type_name:
 *                     type: string
 *                     example: Eau de Parfum
 *                   name:
 *                     type: string
 *                     example: La vie est belle
 *                   image:
 *                     type: string
 *                     example: https://cdn.flaconi.de/media/catalog/product/l/a/lancome-la-vie-est-belle-eau-de-parfum-50-ml-3605532612768.jpg
 *                   description:
 *                     type: string
 *                     example: La vie est belle ist ein Duft der Freiheit und des Glücks. Eine Hommage an die Schönheit des Lebens. Das Eau de Parfum verzaubert mit edlen, natürlichen Ingredienzen wie Pallida de Florence-Iris, Sambac-Jasmin-Absolu, Orangenblüten-Absolu und einer Patschuli-Essenz, die von sanften Gourmet-Noten eingehüllt werden. Ein einzigartiger Duftcharakter. Exklusiv von drei der größten französischen Parfümeure für Lancôme kreiert. 
 *                   rating:
 *                     type: number
 *                     example: 4.3
 *                   created:
 *                     type: string
 *                     example: 2021-12-13 10:48:45
 *                   timestamp:
 *                     type: string
 *                     example: 2021-12-13 10:48:45
 *                   size:
 *                     type: integer
 *                     example: 30
 *                   price:
 *                     type: number
 *                     example: 38.95
 *                   original_price:
 *                     type: number
 *                     example: 62.50
 *                   discount_percentage:
 *                     type: integer
 *                     example: 38
 *                   base_size:
 *                     type: integer
 *                     example: 100
 *                   base_price:
 *                     type: number
 *                     example: 129.83
 */

// http://localhost:5000/api/v1/items/
router.get('/', async (req, res) => {
  try {
    let whereQuery = []
    let queryState = []

    if(req.query.id) {
      whereQuery = [...whereQuery, 'i.id IN (?)']
      queryState = [...queryState, req.query.id.split(',')]
    }

    const sortQuery = req.query.sort ? getSortQuery(req.query.sort) : 'i.id'
    const query = `
      SELECT i.id, i.brand_id, ib.brand_name, i.type_id, it.type_name, i.name, i.image, 4.3 rating, i.created, i.timestamp, iv.size, iv.price, iv.original_price, iv.discount_percentage
      FROM item i
      JOIN item_type it ON it.type_id = i.type_id
      JOIN item_brand ib ON ib.brand_id = i.brand_id
      JOIN item_category ic ON ic.category_id = i.category_id
      JOIN (
        SELECT *
        FROM item_variant
        GROUP BY item_id
      ) iv ON iv.item_id = i.id
      WHERE ${whereQuery.length ? whereQuery.join(' AND ') : '1'}
      ORDER BY ${sortQuery};
    `
    const [rows] = await pool.query(query, queryState)
    const result = rows.map(row => {
      return {
        ...row,
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
 * /api/v1/items/{itemId}:
 *   get:
 *     summary: Gets an item by id
 *     description: Gets an item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item id
 *     responses:
 *       200:
 *         description: Item Details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Items'
 */

// http://localhost:5000/api/v1/items/1
router.get('/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId
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
          base_size: BASE_SIZE,
          base_price: round2Decimal(getBasePrice(b.price, b.size, BASE_SIZE))
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

/**
 * @swagger
 * /api/v1/items/{itemId}/variants:
 *   get:
 *     summary: Get lists all the item variants by id
 *     description: Get lists all the item variants by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item id
 *     responses:
 *       200:
 *         description: The list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemVariants'
 */

// http://localhost:5000/api/v1/items/1/variants
router.get('/:itemId/variants', async (req, res) => {
  try {
    const itemId = req.params.itemId
    const query = `
      SELECT item_id, size, stock, price, original_price, discount_amount, discount_percentage, created, timestamp
      FROM item_variant
      WHERE item_id = ?;
    `
    const [rows] = await pool.execute(query, [itemId])
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
 * /api/v1/items/{itemId}/variants/{size}:
 *   get:
 *     summary: Get an item variants by id and size
 *     description: Get an item variants by id and size
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item id
 *       - in: path
 *         name: size
 *         schema:
 *           type: integer
 *         required: true
 *         description: Item Variant Size
 *     responses:
 *       200:
 *         description: The list of items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemVariants'
 */

// http://localhost:5000/api/v1/items/1/variants/30
router.get('/:itemId/variants/:size', async (req, res) => {
  try {
    const itemId = req.params.itemId
    const size = req.params.size
    const query = `
      SELECT item_id, size, stock, price, original_price, discount_amount, discount_percentage, created, timestamp
      FROM item_variant
      WHERE item_id = ? AND size = ?;
    `
    const [rows] = await pool.execute(query, [itemId, size])
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
    }).reduce((a,b) => b, {})
    return res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' })
    console.error(e)
  }
})

module.exports = router