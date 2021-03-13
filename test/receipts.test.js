const chai = require('chai')
const { expect } = require('chai')
const should = chai.should()
const request = require('supertest')
const sinon = require('sinon')
const app = require('../app')
const db = require('../models/index')
const { User, Tag, Receipt, Item } = db
const bcrypt = require('bcryptjs')
const helper = require('../helper')

describe('Receipt Upload', () => {
  let token
  before(async () => { // register a user and get token before test
    await User.destroy({ where: {}, truncate: true })
    const password = 'password'
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    await db.User.create({
      name: 'test',
      merchant: 'Test Store',
      tel: '1234567',
      email: 'test@example.com',
      password: hashedPassword
    })

    const res = await request(app) // login
      .post('/user/login')
      .send({ email: 'test@example.com', password: 'password' })

    token = res.body.token

    this.getUser = sinon.stub(helper, 'getUser') // stub helper(req).user
      .returns({ id: 1 })

    await Tag.create({
      tagName: 'testTag1',
      UserId: 1
    })
  })

  it('Receipt upload', (done) => {
    request(app)
      .post('/receipts/upload')
      .set('Authorization', 'Bearer ' + token)
      .field('tag', 'testTag1')
      .attach('receipt', 'quiz_sample_receipts/sample_receipt_5.txt')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const findReceipt = Receipt.findByPk(1)
        const findItem = Item.findByPk(1)
        Promise.all([findReceipt, findItem])
          .then(([receipt, item]) => {
            receipt.UserId.should.equal(1)
            receipt.receiptID.should.equal('122769')
            receipt.TagId.should.equal(1)
            item.itemId.should.equal('8888196173423')
            item.itemName.should.equal('Pokka Green Tea Jasmine 1.5L')
            item.price.should.equal(2.20)
            return done()
          })
      })
  })

  after(async () => {
    this.getUser.restore()
    await User.destroy({ where: {}, truncate: true })
    await Receipt.destroy({ where: {}, truncate: true })
    await Item.destroy({ where: {}, truncate: true })
    await Tag.destroy({ where: {}, truncate: true })
  })
})
