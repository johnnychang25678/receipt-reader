const express = require('express')
const multer = require('multer')
const getStream = require('get-stream')

const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage })


app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  console.log(req.body)
})

app.post('/receipts/upload', upload.single('receipt'), async (req, res) => {
  const { file } = req
  console.log(file)
  const multerText = Buffer.from(file.buffer).toString()
  console.log(multerText)

  const arr = multerText.split('\r\n')
  const date = arr[4].slice(5, 15)
  const time = arr[4].slice(22)
  const receiptId = arr[5].slice(arr[5].search('ID') + 3)
  console.log(receiptId)
  let i = 7 // purchase items start from arr[7]
  const itemNumbers = []
  const itemNames = []
  const purchaseQty = []
  const itemDollars = []
  while (arr[i] !== '') {
    // handle items
    if (i % 2 !== 0) {
      const sliceIndex = arr[i].indexOf(' ')
      const itemNumber = arr[i].slice(0, sliceIndex)
      itemNumbers.push(itemNumber)
      const itemName = arr[i].slice(sliceIndex + 1)
      itemNames.push(itemName)
    }

    // handle quantity and dollar
    if (i % 2 === 0) {
      // slice the total from back and remove the spaces
      const quantityByDollar = arr[i].slice(0, -20).split(' ').join('')
      const sliceIndex = quantityByDollar.indexOf('x')
      const quantity = quantityByDollar.slice(0, sliceIndex)
      purchaseQty.push(quantity)
      const dollar = quantityByDollar.slice(sliceIndex + 1)
      itemDollars.push(dollar)
    }

    i++
  }
  console.log(date, time, itemNumbers, itemNames, purchaseQty, itemDollars)
  console.log('i: ', i)
  const result = {
    text: multerText
  }
  console.log(arr)
  res.send(result.text)
})

app.get('/receipts/:tag')
app.post('/receipts/:id')


app.listen(3000, () => console.log('App running at port 3000'))