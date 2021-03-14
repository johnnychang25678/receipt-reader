const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    version: '1.0.0',
    title: 'Receipt Reader REST API'
  },
  definitions: {
    Tag: {
      id: 1,
      tagName: "bob's tag",
      UserId: 1,
      createdAt: '2021-03-13T03:24:00.000Z',
      updatedAt: '2021-03-13T03:24:00.000Z'
    },
    Receipt: {
      id: 1,
      date: '05.04.2020',
      time: '08:48:04',
      UserId: 1,
      receiptID: '87450',
      TagId: 1,
      createdAt: '2021-03-13T03:24:00.000Z',
      updatedAt: '2021-03-13T03:24:00.000Z',
      ReceiptItems: [
        {
          ItemId: 1,
          ReceiptId: 1,
          quantity: 4,
          createdAt: '2021-03-13T03:24:00.000Z',
          updatedAt: '2021-03-13T03:24:00.000Z'
        },
        {
          ItemId: 2,
          ReceiptId: 1,
          quantity: 1,
          createdAt: '2021-03-13T03:24:00.000Z',
          updatedAt: '2021-03-13T03:24:00.000Z'
        }
      ],
      Items: [
        {
          id: 1,
          itemId: '88823027',
          itemName: 'Viceroy Menthol Super',
          price: 11.7,
          createdAt: '2021-03-13T03:24:00.000Z',
          updatedAt: '2021-03-13T03:24:00.000Z',
          ReceiptItem: {
            ItemId: 1,
            ReceiptId: 1,
            quantity: 4,
            createdAt: '2021-03-13T03:24:00.000Z',
            updatedAt: '2021-03-13T03:24:00.000Z'
          }
        },
        {
          id: 2,
          itemId: '7622210400291',
          itemName: 'Daily Milk Roast Almond',
          price: 3.8,
          createdAt: '2021-03-13T03:24:00.000Z',
          updatedAt: '2021-03-13T03:24:00.000Z',
          ReceiptItem: {
            ItemId: 2,
            ReceiptId: 1,
            quantity: 1,
            createdAt: '2021-03-13T03:24:00.000Z',
            updatedAt: '2021-03-13T03:24:00.000Z'
          }
        }
      ]
    }
  }

}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
