const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

const defaultUsers = [
  {
    userId: "f52e9da6-5962-4e19-b601-62af23d826dc",
    firstName: "Steven",
    lastName: "Audrey"
  },
  {
    userId: "72c9e37f-f0aa-4c47-8e16-f5edcf230c9a",
    firstName: "Lennart",
    lastName: "Reckschmidt"
  },
  {
    userId: "4299e898-198e-46cb-8363-8ce729ca94e9",
    firstName: "Maryna",
    lastName: "Kyrylyuk"
  },
  {
    userId: "a3f45265-f720-424e-871c-ccdc33abf211",
    firstName: "Yohana",
    lastName: "Priskila"
  }
]
let users = defaultUsers

router.get("/", (req, res) => {
  try {
    return res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.get("/:id", (req, res) => {
  try {
    const userId = req.params.id
    const user = users.find(user => user.userId === userId)
    return res.json(user)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.post("/", (req, res) => {
  try {
    const userId = uuidv4()
    const user = {userId: userId, ...req.body}
    users = [...users, user]
    return res.json(user)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.post("/default", (req, res) => {
  try {
    users = defaultUsers
    return res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.put("/:id", (req, res) => {
  try {
    const userId = req.params.id
    users = users.map(user => user.userId === userId ? {...user, ...req.body} : user)
    return res.json({userId, ...req.body})
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.delete("/", (req, res) => {
  try {
    users = []
    return res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

router.delete("/:id", (req, res) => {
  try {
    const userId = req.params.id
    users = users.filter(user => user.userId !== userId)
    return res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong.' });
    console.error(e)
  }
})

module.exports = router