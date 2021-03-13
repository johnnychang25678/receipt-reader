const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User } = db

// register
router.post('/register', async (req, res) => {
  const { name, merchant, tel, email, password, passwordCheck } = req.body
  if (!name || !merchant || !tel || !email || !password || !passwordCheck) {
    return res.status(400).json('All fields are mandatory')
  }
  if (password !== passwordCheck) {
    return res.status(400).json('Password doesn\'t match!')
  }
  const user = await User.findOne({
    where: { email }
  })
  if (user) {
    return res.status(400).json('The account already exist')
  }
  const merchantName = await User.findOne({
    where: { merchant }
  })

  if (merchantName) {
    return res.status(400).json('The merchant name already exist')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  await User.create({
    name,
    merchant,
    tel,
    email,
    password: hashedPassword
  })

  return res.status(200).json('Regsitration success!')
})

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json('All fields are mandatory!')
  }
  const user = await User.findOne({
    where: { email }
  })

  if (!user) {
    return res.status(400).json('no such user found')
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json('password not match')
  }
  const payload = {
    id: user.id
  }

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 * 7 } // expires in a week
  )

  return res.status(200).json({
    token
  })
})

module.exports = router
