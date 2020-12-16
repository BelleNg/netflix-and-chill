const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries')
require('isomorphic-fetch');
const db = require('./database');

const users = [{name: 'Belle', password: '123'}];

app.use(cors());
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
app.post('/users/login', async (req, res) => {
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
app.post('/users/signup', async (req, res) => {
    try { 
        const uniqueEmail = await queries.getEmail(req.body.email);
        if (uniqueEmail) {
            return res.status(500).send('email is already in system');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // console.log('hashedpass', hashedPassword)
        const user = { username: req.body.username, password: hashedPassword, email: req.body.email };
        await queries.createUser(user);
        // console.log(createdUser);
        res.status(201).send('success user creation');
    } catch(err) {
        // console.log(err);
        res.status(500).send('user was not created');
    }
})

// TODO add movies to user
// app.post('/users/:userid/movies', (req, res) => {
//     try {
//         // add movies to users 
//         res.status(201).send('user movie list successfully updated');
//     } catch(err) {
//         res.status(500).send('movies not added to user');
//     }
// })

// update Username
app.put('/users/updateUsername', async (req, res) => {
    try {
        await queries.updateUsername(req.body.username, req.body.newUsername);
        res.status(201).send('username changed')
    } catch(err) {
        res.status(500).send('username was not changed')
    }
})

// delete user forever
// TODO - name better rest APIs and check route app.delete
app.post('/users/delete', async (req, res) => {
    try {
        await queries.deleteUser(req.body.email);
        res.status(201).send('user deleted')
    } catch(err) {
        res.status(500).send('user was not created');
    }
})

//GET MOVIES FROM TMDB and Insert into Database
app.get('/movies', async (req, res) => {
    try {
        await queries.populateMovies();
        res.status(201).send('Movies queried and inserted to database');

    } catch (err) {
        res.status(500).send("cannot populate movies table");
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })

