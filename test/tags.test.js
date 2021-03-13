const chai = require('chai')
const { expect } = require('chai')
const should = chai.should()
const request = require('supertest')
const sinon = require('sinon')
const app = require('../app')
const db = require('../models/index')
const { User, Tag } = db
const bcrypt = require('bcryptjs')
const helper = require('../helper')

describe('tags CRUD', () => {
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

  it('Post a new tag', (done) => {
    request(app)
      .post('/tags')
      .set('Authorization', 'Bearer ' + token)
      .send({ tagName: 'testTag2' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        Tag.findByPk(2)
          .then(tag => {
            tag.UserId.should.equal(1)
            tag.tagName.should.equal('testTag2')
            return done()
          })
      })
  })

  it('Read tags', (done) => {
    request(app)
      .get('/tags')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.be.an('array') // expect is from chai
        res.body[0].tagName.should.equal('testTag1')
        return done()
      })
  })

  it('Read single tag', (done) => {
    request(app)
      .get('/tags/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.tagName.should.equal('testTag1')
        return done()
      })
  })

  it('Update single tag', (done) => {
    request(app)
      .put('/tags/1')
      .set('Authorization', 'Bearer ' + token)
      .send({
        tagName: 'putTag'
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.tagName.should.equal('putTag')
        return done()
      })
  })

  it('Delete a tag', (done) => {
    request(app)
      .delete('/tags/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        Tag.findByPk(1).then(tag => {
          expect(tag).to.be.null
        })
        return done()
      })
  })

  after(async () => {
    this.getUser.restore()
    await db.User.destroy({ where: {}, truncate: true })
    await db.Tag.destroy({ where: {}, truncate: true })
  })
})
