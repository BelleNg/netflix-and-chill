const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries')

const users = [{name: 'Belle', password: '123'}];

app.use(express.json());
app.use(express.static(__dirname + '/public'));
 
app.get('/', (req, res) => {
 res.send({working: true})
 queries.authenticate();
})

app.get('/users', (req, res) => {
    res.json(users);
   })


// user login
app.post('/users/login/', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Successly logged in')
        } else {
            res.send('Wrong username or password')
        }
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
})

// creation of user
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log('hashedpass', hashedPassword)
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send('success user creation');
    } catch (err) {
        console.log(err);
        res.status(500).send('user cannot be created');
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })

