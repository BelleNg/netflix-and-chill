const Sequelize = require('sequelize');
const db = require('./database.js');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Genre = require('./models/Genre');

function authenticate() {
    db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
};

async function getUsers() {
    try {
        const users = await User.findAll({
            attributes: ['username', 'password', 'email']
        });
        return users;
    } catch (err) {
        console.log(err);
        throw new Error("error in database");
    }
}

// checks if user email is unique
async function getEmail(email) {
    try {
        const user = await User.findOne({ 
            where: {
            email: email
            }
          });
        return user;
    } catch (err) {
        console.log(err);
        throw new Error("error in database");
    }
}

// create user in Users table
async function createUser({ username, password, email }) {
    try {
        await User.create({ 
            username: username, 
            password: password, 
            email: email
        });
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

// TODO add movie to user list
// function insertUserMovies() {
//     // add movie - user connection in users_movies table.
// }

// update username
async function updateUsername(oldUsername, newUsername) {
    try {
        await User.update({ username: newUsername},{
            where: {
                username: oldUsername
            }
        });
    } catch (err) {
        console.log(err);
        // TODO change error to proper error
        return "error in updateUsername"; 
    }
}

// TODO create queries for
// update email
// update password

// delete user in Users table
async function deleteUser(email) {
    try {
        await User.destroy({
            where: { 
                email: email,
            }
        });
    } catch (err) {
        console.log("error in deleteUser",err);
        // TODO change error to proper error
        return "error in deleteUser";
    }
}

//fetch movies from database
async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`)
        const movies = await response.json();
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return movies.results
    } catch (err) {
       return "error in fetchMovies", err;
    }
}

//insert movies to database
async function insertMovies(movies) {
    const list = movies.map( (movie) => {
        return {
            id: movie.id,
            title: movie.title,
            genre_ids: movie. genre_ids,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path
        }
    })
    
     try {
        Movie.bulkCreate(list, 
            { returning: ['title'] })
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

//populate database with movies
async function populateMovies() {
    const movies = await fetchMovies();
    const insert = await insertMovies(movies);
    return insert;
}

module.exports = { authenticate, getUsers, getEmail, createUser, deleteUser, updateUsername, populateMovies};