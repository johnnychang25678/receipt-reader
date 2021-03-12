const passport = require('passport')
const passportJWT = require('passport-jwt')
const db = require('../models/index')
const { User } = db

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const currentUser = await User.findByPk(jwt_payload.id, {
    attributes: { exclude: ['password'] }
  })

  if (!currentUser) return next(null, false)

  return next(null, currentUser.toJSON())
})
passport.use(strategy)

module.exports = passport
