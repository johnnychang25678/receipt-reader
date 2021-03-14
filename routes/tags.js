const express = require('express')
const router = express.Router()
const helper = require('../helper')
const { getUser } = helper

const db = require('../models')
const { Tag } = db

// create tag
router.post('/', async (req, res, next) => {
  /*  #swagger.tags = ['Tag']
      #swagger.description = 'Create a tag'
      #swagger.parameters['obj'] = {
        in: 'body',
        type: "object",
        description: "Input tag name",
        schema: {
            tagName: "tagName"
          },
        required: true
      }
      #swagger.responses[200] = {
        description: 'Respond with a tag object',
        schema: {"$ref": "#definitions/Tag"}
      }
      #swagger.responses[400] = {
        description: "Respond with 400 if no tagName.",
        schema: "tagName is mandatory!"
      }
  */
  try {
    const { tagName } = req.body
    if (!tagName) {
      return res.status(400).json('tagName is mandatory!')
    }
    const tag = await Tag.create({
      tagName,
      UserId: getUser(req).id
    })
    return res.status(200).json(tag)
  } catch (err) {
    next(err)
  }
})

// read tags
router.get('/', async (req, res, next) => {
  /*  #swagger.tags = ['Tag']
      #swagger.description = 'Get tags of current user'
      #swagger.responses[200] = {
        description: 'Respond with an array with tag objects',
        schema: [{"$ref": "#/definitions/Tag"}]
      }
      #swagger.responses[400] = {
        description: "Respond with 400 if no tags found.",
        schema: "tagName is mandatory!"
      }
  */
  try {
    const tags = await Tag.findAll({
      where: { UserId: getUser(req).id }
    })
    if (!tags || tags.length === 0) {
      return res.status(400).json('No tags found')
    }
    return res.status(200).json(tags)
  } catch (err) {
    next(err)
  }
})
// read single tag
router.get('/:tagId', async (req, res, next) => {
  /*  #swagger.tags = ['Tag']
      #swagger.description = 'Get tags of current user'
      #swagger.responses[200] = {
        description: 'Respond with a tag object',
        schema: {"$ref": "#/definitions/Tag"}
      }
      #swagger.responses[400] = {
        description: "Respond with 400 if no tags found.",
        schema: "tag doesnt exist!"
      }
  */
  try {
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
  } catch (err) {
    next(err)
  }
})

// update single tag
router.put('/:tagId', async (req, res, next) => {
  /*  #swagger.tags = ['Tag']
      #swagger.description = 'Update a tag name'
      #swagger.parameters['obj'] = {
        in: 'body',
        type: "object",
        description: "Input tagName",
        schema: {
            tagName: "tagName"
          },
        required: true
      }
      #swagger.responses[200] = {
        description: 'Respond with updated tag object',
        schema: {"$ref": "#definitions/Tag"}
      }
      #swagger.responses[400] = {
        description: "Respond with 400 if tag not found.",
        schema: "tag doesnt exist!"
      }
  */
  try {
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
  } catch (err) {
    next(err)
  }
})

// delete single tag
router.delete('/:tagId', async (req, res, next) => {
  /*  #swagger.tags = ['Tag']
      #swagger.description = 'Delete a tag'
      #swagger.responses[200] = {
        description: 'Respond with success message',
        schema: 'delete success'
      }
      #swagger.responses[400] = {
        description: "Respond with 400 if tag not found.",
        schema: "tag doesnt exist!"
      }
  */
  try {
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
  } catch (err) {
    next(err)
  }
})

module.exports = router
