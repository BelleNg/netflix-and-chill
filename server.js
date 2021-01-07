const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config({path: path.resolve(__dirname+'/.env')});
const queries = require('./queries');
const movieQueries = require('./movieQueries');
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
    try {
        const users = await queries.getUsers();
        res.json({ users });
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
    // must use try catch block to get errors when using async await functions
})

app.get('/movies', async (req, res) => {
    try {
        const movies = await queries.getAllMovies();
        res.json({ movies });
    } catch(err) {
        console.log(err);
        res.status(500).send();
    }
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

//add movies to user
app.post('/users/:userId/movies', async (req, res) => {
    try {
        // add movies to users 
        await queries.insertUserMovies(req.body.userID, req.body.movies);
        res.status(201).send('user movie list successfully updated');
    } catch(err) {
        res.status(500).send('movies not added to user');
    }
})

// get users that like same movies
app.get('/users/:movieId/matching', async (req, res) => {
    try {
        // get movies for the user
        const movieId = parseInt(req.params.movieId);
        const users = await queries.getUsersByMovieId(movieId);
        if (users) {
            res.send(users);
        } else {
            res.send('No users found')
        }
    } catch(err) {
        console.log(err);
        res.status(500).send('Could not get users');
    }
})

//TODO Misc. features.
// update Username
// app.put('/users/updateUsername', async (req, res) => {
//     try {
//         await queries.updateUsername(req.body.username, req.body.newUsername);
//         res.status(201).send('username changed')
//     } catch(err) {
//         res.status(500).send('username was not changed')
//     }
// })

// // delete user forever
// // TODO name better rest APIs and check route app.delete
// app.post('/users/delete', async (req, res) => {
//     try {
//         await queries.deleteUser(req.body.email);
//         res.status(201).send('user deleted')
//     } catch(err) {
//         res.status(500).send('user was not created');
//     }
// })

//GET MOVIES FROM TMDB and Insert into Database
app.get('/api/movies/:page', async (req, res) => {
    try {
        await movieQueries.populateMovies(req.params.page);
        res.status(201).send('Movies queried and inserted to database');

    } catch (err) {
        res.status(500).send("cannot populate movies table");
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
  })

