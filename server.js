import express from 'express';
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.send({working: true})
   })
   