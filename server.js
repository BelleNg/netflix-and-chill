const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries');
require('isomorphic-fetch');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

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

// app.post("/magicaltesting", async (req, res) => {
//     try {
//         const movie = await queries.getMovie(req.body.movieID);
//         console.log("this is movie",movie);
//         res.send(movie);
//     } catch (err) {
//         res.status(500).send('error on test', err)
//     }
// })


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

// TODO change movie arrays to take from req.body
app.post('/users/:userid/movies', async (req, res) => {
    try {
        // add movies to users 
        await queries.insertUserMovies(req.body.userID, [590995, 682377]);
        res.status(201).send('user movie list successfully updated');
    } catch(err) {
        res.status(500).send('movies not added to user');
    }
})

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
// TODO name better rest APIs and check route app.delete
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

