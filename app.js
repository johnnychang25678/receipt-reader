const express = require('express')
const multer = require('multer')

const db = require('./models/index')
const { Receipt, Tag, ReceiptItem, Item } = db

const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage })

const receiptTransform = require('./utils/receiptTransform')

app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  console.log(req.body)
})

// upload receipt and add tag to it
app.post('/receipts/upload', upload.single('receipt'), async (req, res) => {
  const { file } = req
  const { tag } = req.body
  if (!file || !tag) {
    return res.status(400).json('File and tag are mandatory!')
  }
  const tagExist = await Tag.findOne({
    where: { tagName: tag }
  })
  let newTag
  if (!tagExist) {
    newTag = await Tag.create({
      tagName: tag
    })
  }
  const receiptData = receiptTransform(file)
  if (!receiptData) {
    return res.status(500).json('Server Error')
  }
  const { date, time, receiptID, itemNumbers, itemNames, purchaseQty, itemDollars } = receiptData
  const newReceipt = await Receipt.create({
    MerchantId: 1,
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

})

// get receipts from tagName
app.get('/receipts/:tagName', async (req, res) => {
  const { tagName } = req.params
  const receipts = await Tag.findOne({
    where: { tagName },
    include: [
      {
        model: Receipt,
        include: [
          ReceiptItem,
          { model: Item, as: 'Items' }
        ]
      },

    ]
  })

  res.status(200).json(receipts)
})

app.post('/receipts/:id')


// create tag
app.post('/tags', async (req, res) => {
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
app.get('/tags', async (req, res) => {
  const tags = await Tag.findAll()
  if (!tags || !tags.length) {
    return res.status(400).json('No tags found')
  }
  return res.status(200).json(tags)
})
// read tag
app.get('/tags/:tagName', async (req, res) => {
  const { tagName } = req.params
  const tag = await Tag.findOne({
    where: { tagName }
  })
  if (!tag) {
    return res.status(400).json('tagName doesn\'t exist!')
  }
  return res.status(200).json(tag)
})

// update
app.put('/tags/:tagName', async (req, res) => {
  const { tagName } = req.params
  const tag = await Tag.findOne({
    where: { tagName }
  })
  if (!tag) {
    return res.status(400).json('tagName doesn\'t exist!')
  }
  const updatedTag = await tag.update({
    tagName
  })

  return res.status(200).json(updatedTag)
})

// delete
app.delete('/tags/:tagName', async (req, res) => {
  const tag = await Tag.findOne({
    where: { tagName }
  })
  await tag.destroy()
  return res.status(200).json('delete success')
})

app.listen(3000, () => console.log('App running at port 3000'))