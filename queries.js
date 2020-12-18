const Sequelize = require('sequelize');
const db = require('./database.js');
const { User, Movie, Genre } = require('./models');

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

// get user from database - works
async function getUser(userID) {
    try {
        const user = await User.findOne({ 
            where: {
            id: userID
            }
          });
        return user;
    } catch (err) {
        console.log(err, "error in getUser");
        throw new Error("error in database")
    }
}
// find movie from database - works

async function getMovie(movieID) {
    try {
        const movie = await Movie.findOne({ 
            where: {
            id: movieID
            }
          });
        return movie;
    } catch (err) {
        console.log(err, "error in getUser");
        throw new Error("error in database")
    }
}

// TODO add movie to user list
async function insertUserMovies(userID, movieNums) {
    // add movie - user connection in users_movies table.
    try {
        const user = await getUser(userID);
        console.log(user);
        movieNums.map( async (movieID) => {
            let movie =  await getMovie(movieID);
            let output = await user.addMovies(movie);
            console.log("this is userMovies", output)
        });
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }

}

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
        throw new Error("error in database")
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
        console.log(err);
        throw new Error("error in database")
    }
}

//fetch movies from database
//TODO: change pages to not hard code
async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`)
        const movies = await response.json();
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return movies.results
    } catch (err) {
        console.log(err);
        throw new Error("error in database")
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
    try {
        const movies = await fetchMovies();
        await insertMovies(movies);

    } catch (err) {
        console.log(err);
        throw new Error("error in database")
    }
}

module.exports = { authenticate, 
    getUsers, 
    getEmail,
    getMovie,
    createUser, 
    deleteUser, 
    updateUsername, 
    insertUserMovies, 
    populateMovies};