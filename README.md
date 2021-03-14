# Receipt Reader
A backend API server to manage receipts. Built with below tech stack:
- Backend language / framework: Node.js / Express.js 
- Database: MySQL / Sequelize
- Unit test: Mocha.js

The server is deployed on Heroku. API documentation:

https://blooming-wildwood-31321.herokuapp.com/api-doc

## Quick start
Recommend to test APIs with [postman](https://www.postman.com)

1. Register a new account at POST /user/register
2. Login in at POST /user/login and receive a token
3. Now you can test out any route you like! Don't forget to add {Authorization: Bearer yourToken} at your request header
4. Please download sample receipts from this repo at /quize_sample_receipts
5. Try to upload receipt at POST /receipts/upload