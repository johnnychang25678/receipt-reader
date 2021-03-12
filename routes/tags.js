const express = require('express')
const router = express.Router()

const db = require('../models')
const { Tag } = db

// create tag
router.post('/tags', async (req, res) => {
  const { tagName } = req.body
  if (!tagName) {
    return res.status(400).json('tagName is mandatory!')
  }
  const tag = await Tag.create({
    tagName
  })
  return res.status(200).json(tag)
})

// read tags
router.get('/tags', async (req, res) => {
  const tags = await Tag.findAll()
  if (!tags || tags.length === 0) {
    return res.status(400).json('No tags found')
  }
  return res.status(200).json(tags)
})
// read single tag
router.get('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params
  const tag = await Tag.findByPk(tagId)
  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  return res.status(200).json(tag)
})

// update single tag
router.put('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params
  const { tagName } = req.body // front end input tagName=newTagName
  const tag = await Tag.findByPk(tagId)

  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  const updatedTag = await tag.update({
    tagName
  })

  return res.status(200).json(updatedTag)
})

// delete single tag
router.delete('/tags/:tagId', async (req, res) => {
  const { tagId } = req.params
  const tag = await Tag.findByPk(tagId)
  if (!tag) {
    return res.status(400).json('tag doesn\'t exist!')
  }
  await tag.destroy()
  return res.status(200).json('delete success')
})

module.exports = router
