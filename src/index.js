require('dotenv').config()
const express = require('express')
const app = express()

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.use(express.urlencoded())
app.use(express.json())

/** Start Route Definition */
app.get('/', (req, res) => {
	res.send('Hello World AdvSE-backend')
})

app.use('/api/v1/users', require('./api/v1/users'))
app.use('/api/v1/items', require('./api/v1/items'))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}...`))