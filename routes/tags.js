const express = require('express')
const router = express.Router()
const helper = require('../helper')
const { getUser } = helper

const db = require('../models')
const { Tag } = db

// create tag
router.post('/', async (req, res) => {
  const { tagName } = req.body
  if (!tagName) {
    return res.status(400).json('tagName is mandatory!')
  }
  const tag = await Tag.create({
    tagName,
    UserId: getUser(req).id
  })
  return res.status(200).json(tag)
})

// read tags
router.get('/', async (req, res) => {
  const tags = await Tag.findAll({
    where: { UserId: getUser(req).id }
  })
  if (!tags || tags.length === 0) {
    return res.status(400).json('No tags found')
  }
  return res.status(200).json(tags)
})
// read single tag
router.get('/:tagId', async (req, res) => {
  const { tagId } = req.params
  const tag = await Tag.findOne({
    where: {
      id: tagId,
      UserId: getUser(req).id
    }
  })
  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  return res.status(200).json(tag)
})

// update single tag
router.put('/:tagId', async (req, res) => {
  const { tagId } = req.params
  const { tagName } = req.body // front end input tagName=newTagName
  const tag = await Tag.findOne({
    where: {
      id: tagId,
      UserId: getUser(req).id
    }
  })

  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  const updatedTag = await tag.update({
    tagName
  })

  return res.status(200).json(updatedTag)
})

// delete single tag
router.delete('/:tagId', async (req, res) => {
  const { tagId } = req.params
  const tag = await Tag.findOne({
    where: {
      id: tagId,
      UserId: getUser(req).id
    }
  })
  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  await tag.destroy()
  return res.status(200).json('delete success')
})

module.exports = router
