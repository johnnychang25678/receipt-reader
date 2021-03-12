const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const receipts = require('./receipts')
const tags = require('./tags')
const user = require('./user')

const authenticated = passport.authenticate('jwt', { session: false })

router.use('/user', user)
router.use('/receipts', authenticated, receipts)
router.use('/tags', authenticated, tags)

module.exports = router
