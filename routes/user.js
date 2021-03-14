const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const { User } = db

// register
router.post('/register', async (req, res, next) => {
  /*  #swagger.tags = ['User']
        #swagger.description = 'User Registration'
        #swagger.parameters['obj'] = {
          in: 'body',
          type: "object",
          description: "All fields are mandatory",
          schema: {
              name: "name",
              merchant: "Bobs Store",
              tel: "12345678",
              email: "bob@example.com",
              password: "123456",
              passwordCheck: "123456"
            },
          required: true
        }
        #swagger.responses[200] = {
          description: 'Respond with success message',
          schema: 'Registration Sucess!'
        }
        #swagger.responses[400] = {
          description: "Will return 400 if password does not match or missing fileds or the email already existed or the merachant name already existed. The response is dependant on the situation.",
          schema: "The account already exist"

        }
    */
  try {
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
  } catch (err) {
    next(err)
  }
})

// login
router.post('/login', async (req, res, next) => {
  /*  #swagger.tags = ['User']
      #swagger.description = 'User Login'
      #swagger.parameters['obj'] = {
        in: 'body',
        type: "object",
        description: "Input email and password to login",
        schema: {
            email: "bob@example.com",
            password: "123456",
          },
        required: true
      }
      #swagger.responses[200] = {
        description: 'Respond with a token object',
        schema: {token: "yourToken"}
      }
      #swagger.responses[400] = {
        description: "Will return 400 if password is wrong or missing fileds or the acoount does not exist. The response is dependant on the situation.",
        schema: "no such user found"
      }
  */
  try {
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
  } catch (err) {
    next(err)
  }
})

module.exports = router
