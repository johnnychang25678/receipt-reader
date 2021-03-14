if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const routes = require('./routes/index')

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// for api doc
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(routes)

app.use((err, req, res, next) => {
  console.log(err)
  return res.status(500).json('Server Error')
})

app.listen(port, () => console.log(`App running at port ${port}`))

module.exports = app
