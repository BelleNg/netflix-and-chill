const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries')


app.use(express.static(__dirname + '/public'));
 
app.get('/', (req, res) => {
 res.send({working: true})
 queries.authenticate();
})
 
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })

