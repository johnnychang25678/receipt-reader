const express = require('express')
const router = express.Router()
const helper = require('../helper')
const { getUser } = helper

const receiptTransform = require('../utils/receiptTransform')
const db = require('../models')
const { Tag, Receipt, Item, ReceiptItem } = db

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// upload receipt and add tag to it
router.post('/upload', upload.single('receipt'), async (req, res, next) => {
  try {
    const { file } = req
    const { tag } = req.body
    if (!file || !tag) {
      return res.status(400).json('File and tag are mandatory!')
    }
    const tagExist = await Tag.findOne({
      where: { tagName: tag, UserId: getUser(req).id }
    })
    let newTag
    if (!tagExist) {
      newTag = await Tag.create({
        tagName: tag,
        UserId: getUser(req).id
      })
    }
    const receiptData = receiptTransform(file)
    if (!receiptData) {
      return res.status(500).json('Server Error')
    }
    const { date, time, receiptID, itemNumbers, itemNames, purchaseQty, itemDollars } = receiptData

    const newReceipt = await Receipt.create({
      UserId: getUser(req).id,
      receiptID,
      date,
      time,
      TagId: tagExist ? tagExist.id : newTag.id
    })
    for (let i = 0; i < itemNumbers.length; i++) {
      const itemExist = await Item.findOne({
        where: { itemId: itemNumbers[i] }
      })
      let newItem
      if (!itemExist) {
        newItem = await Item.create({
          itemId: itemNumbers[i],
          itemName: itemNames[i],
          price: itemDollars[i]
        })
      }
      await ReceiptItem.create({
        ItemId: itemExist ? itemExist.id : newItem.id,
        ReceiptId: newReceipt.id,
        quantity: purchaseQty[i]
      })
    }

    return res.json(receiptData)
  } catch (err) {
    next(err)
  }
})

// get all receipts
router.get('/', async (req, res, next) => {
  try {
    const receipts = await Receipt.findAll({
      where: { UserId: getUser(req).id },
      include: [
        ReceiptItem,
        { model: Item, as: 'Items' }
      ]
    })

    if (!receipts || !receipts.length) {
      return res.status(400).json('No receipts found')
    }
    return res.status(200).json(receipts)
  } catch (err) {
    next(err)
  }
})

// get single receipt
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const receipt = await Receipt.findByPk(id, {
      where: { UserId: getUser(req).id },
      include: [
        ReceiptItem,
        { model: Item, as: 'Items' }
      ]
    })

    if (!receipt) {
      return res.status(400).json('Receipt not found')
    }
    return res.status(200).json(receipt)
  } catch (err) {
    next(err)
  }
})

// edit receipt tag
router.put('/tags/:id', async (req, res, next) => {
  try {
    const { id } = req.params // receipt id
    const { tagId } = req.body
    // user can only input existed tagId
    const tag = await Tag.findByPk(tagId, {
      where: { UserId: getUser(req).id }
    })
    if (!tag) {
      return res.status(400).json('Please input valid tag')
    }
    const receipt = await Receipt.findByPk(id)
    if (!receipt) {
      return res.status(400).json('Receipt not found')
    }
    await receipt.update({
      TagId: tagId
    })
    return res.status(200).json(receipt)
  } catch (err) {
    next(err)
  }
})

// get receipts from tagName
router.get('/tags/:tagName', async (req, res, next) => {
  try {
    const { tagName } = req.params
    const tag = await Tag.findOne({
      where: { tagName, UserId: getUser(req).id },
      include: [
        {
          model: Receipt,
          include: [
            ReceiptItem,
            { model: Item, as: 'Items' }
          ]
        }
      ]
    })

    if (!tag) {
      return res.status(400).json('Please enter valid tagName')
    }

    const receipts = tag.Receipts

    if (!receipts || receipts.length === 0) {
      return res.status(400).json('No receipts found')
    }

    return res.status(200).json(receipts)
  } catch (err) {
    next(err)
  }
})

module.exports = router
