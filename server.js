const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries')
const db = require('./database');

const users = [{name: 'Belle', password: '123'}];

app.use(express.json());
app.use(express.static(__dirname + '/public'));

// TODO create a seed file for this function. 
// db.sync({ force: true });

app.get('/', (req, res) => {
    queries.getUsers().then(users => {
        res.json({ users });
    });
    // res.send({working: true})
})

app.get('/users', async (req, res) => {
    const users = await queries.getUsers();
    res.json({ users });
    // must use try catch block to get errors when using async await functions

})


// user login
app.post('/users/login/', async (req, res) => {
    const user = await queries.getEmail(req.body.email);
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.dataValues.password)) {
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
    const uniqueEmail = await queries.getEmail(req.body.email);
    if (uniqueEmail) {
        return res.status(500).send('email is already in system');
    }
    try { 
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // console.log('hashedpass', hashedPassword)
        const user = { username: req.body.name, password: hashedPassword, email: req.body.email };
        const createdUser = await queries.createUser(user);
        // console.log(createdUser);
        res.status(201).send('success user creation');
    } catch (err) {
        // console.log(err);
        res.status(500).send('user was not created');
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })

