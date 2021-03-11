const receiptTransform = (file) => {
  const multerText = Buffer.from(file.buffer).toString()
  const arr = multerText.split('\r\n')
  const date = arr[4].slice(5, 15)
  const time = arr[4].slice(22)
  const receiptID = arr[5].slice(arr[5].search('ID') + 3)

  let i = 7
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

  // check if lengths are identical
  if (new Set([
    itemNumbers.length,
    itemNames.length,
    itemDollars.length]).size !== 1) {
    return false
  }

  return {
    date,
    time,
    receiptID,
    itemNumbers,
    itemNames,
    purchaseQty,
    itemDollars
  }
}

module.exports = receiptTransform