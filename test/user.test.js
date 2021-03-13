const chai = require('chai')
const should = chai.should()
const request = require('supertest')
const app = require('../app')
const db = require('../models/index')
const { User } = db

describe('Register user', () => {
  context('# POST /user/register', () => {
    before(async () => {
      await db.User.destroy({ where: {}, truncate: true })
    })

    it('Registration success', (done) => {
      request(app)
        .post('/user/register')
        .send({
          name: 'test',
          email: 'test@example.com',
          merchant: 'Test Store',
          tel: '12345678',
          password: '123456',
          passwordCheck: '123456'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end(async (err, res) => {
          if (err) return done(err)
          const user = await User.findByPk(1)
          user.name.should.equal('test')
          user.email.should.equal('test@example.com')
          user.merchant.should.equal('Test Store')
          user.tel.should.equal('12345678')
          return done()
        })
    })

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true })
    })
  })
})
