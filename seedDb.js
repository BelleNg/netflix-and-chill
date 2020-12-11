const path = require('path');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const db = require('./database');
require('./models') // this means ./models/index

db.sync({ force: true });